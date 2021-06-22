import React, {useEffect, useRef} from "../_snowpack/pkg/react.js";
import {basicSetup} from "../_snowpack/pkg/@codemirror/basic-setup.js";
import {EditorState, Transaction} from "../_snowpack/pkg/@codemirror/state.js";
import {EditorView, keymap} from "../_snowpack/pkg/@codemirror/view.js";
import {styleTags, tags as t} from "../_snowpack/pkg/@codemirror/highlight.js";
import {LezerLanguage, LanguageSupport, syntaxTree, indentNodeProp, foldNodeProp} from "../_snowpack/pkg/@codemirror/language.js";
import {parser} from "../parser/doenet.js";
export default function CodeMirror(props) {
  let view = props.editorRef;
  let parent = useRef(null);
  useEffect(() => {
    if (view.current === null && parent.current !== null) {
      view.current = new EditorView({state, parent: parent.current});
    }
  });
  function changeFunc(tr) {
    if (tr.docChanged) {
      let value = tr.state.sliceDoc();
      props.onBeforeChange(value);
      return true;
    }
  }
  function matchTag(tr) {
    const cursorPos = tr.newSelection.main.from;
    if (tr.annotation(Transaction.userEvent) == "input" && tr.newDoc.sliceString(cursorPos - 1, cursorPos) === ">") {
      let node = syntaxTree(tr.state).resolve(cursorPos, -1);
      if (node.name !== "OpenTag") {
        return tr;
      }
      let tagNameNode = node.firstChild;
      let tagName = tr.newDoc.sliceString(tagNameNode.from, tagNameNode.to);
      let tra = tr.state.update({changes: {from: cursorPos, insert: "</".concat(tagName, ">")}, sequential: true});
      changeFunc(tra);
      return [tr, {changes: {from: cursorPos, insert: "</".concat(tagName, ">")}, sequential: true}];
    } else {
      return tr;
    }
  }
  const tab = "  ";
  const tabCommand = ({state: state2, dispatch}) => {
    dispatch(state2.update(state2.replaceSelection(tab), {scrollIntoView: true, annotations: Transaction.userEvent.of("input")}));
    return true;
  };
  const tabExtension = keymap.of([{
    key: "Tab",
    run: tabCommand
  }]);
  let parserWithMetadata = parser.configure({
    props: [
      indentNodeProp.add({
        Element(context) {
          let closed = /^\s*<\//.test(context.textAfter);
          return context.lineIndent(context.state.doc.lineAt(context.node.from)) + (closed ? 0 : context.unit);
        },
        "OpenTag CloseTag SelfClosingTag"(context) {
          return context.column(context.node.from) + context.unit;
        }
      }),
      foldNodeProp.add({
        Element(subtree) {
          let first = subtree.firstChild;
          let last = subtree.lastChild;
          if (!first || first.name != "OpenTag")
            return null;
          return {from: first.to, to: last.name == "CloseTag" ? last.from : subtree.to};
        }
      }),
      styleTags({
        AttributeValue: t.string,
        Text: t.content,
        TagName: t.tagName,
        MismatchedCloseTag: t.invalid,
        "MismatchedCloseTag/TagNamed": t.invalid,
        AttributeName: t.propertyName,
        Is: t.definitionOperator,
        "EntityReference CharacterReference": t.character,
        Comment: t.blockComment
      })
    ]
  });
  const doenetLanguage = LezerLanguage.define({
    parser: parserWithMetadata,
    languageData: {
      commentTokens: {block: {open: "<!--", close: "-->"}},
      indentOnInput: /^\s*<\/.+>$/
    }
  });
  const doenet = new LanguageSupport(doenetLanguage, []);
  const state = EditorState.create({
    doc: props.value,
    extensions: [
      basicSetup,
      doenet,
      EditorView.lineWrapping,
      tabExtension,
      EditorState.transactionFilter.of(matchTag),
      EditorState.changeFilter.of(changeFunc)
    ]
  });
  return /* @__PURE__ */ React.createElement("div", {
    ref: parent
  });
}
