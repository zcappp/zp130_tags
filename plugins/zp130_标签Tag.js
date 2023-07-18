import React from "react"

function render(ref) {
    let values = ref.getForm(ref.props.dbf)
    if (!Array.isArray(values)) {
        if (values) warn("表单字段必须是数组")
        values = []
    }
    return <React.Fragment>
    {values.map((a, i) => <div key={i}><label>{a}</label><span onClick={() => del(ref, i)}>{svg.del}</span></div>)}
    {!ref.editting ? <div className="newtag" onClick={() => toAdd(ref)}>{svg.add}<label>{ref.props.newtag || "new tag"}</label></div> : <input onKeyDown={e => e.key == "Enter" && add(ref, e.target.value)} onBlur={e => add(ref, e.target.value)} className="zinput" autoComplete="off"/>}
    </React.Fragment>
}

function toAdd(ref) {
    ref.editting = true
    ref.render()
    setTimeout(() => ref.container.lastChild.focus())
}

function add(ref, v) {
    const { props } = ref
    if (v) {
        let values = ref.getForm(props.dbf)
        if (!Array.isArray(values)) values = []
        values.push(v)
        ref.setForm(props.dbf, values)
        if (props.onAdd) ref.exc(props.onAdd, { ...ref.ctx, $x: v }, () => ref.exc("render()"))
    }
    delete ref.editting
    ref.render()
}

function del(ref, i) {
    ref.exc('confirm("确定要删除吗？")', {}, () => {
        const { props } = ref
        let values = ref.getForm(props.dbf)
        const $x = values.splice(i, 1)[0]
        ref.setForm(ref.props.dbf, values)
        if (ref.props.onDelete) ref.exc(ref.props.onDelete, { ...ref.ctx, $x, $index: i }, () => ref.exc("render()"))
    })
}

const css = `
.zp130 div {
  position: relative;
  float: left;
  margin: 0 4px 4px 0;
  padding: 5px;
  background: #fafafa;
  border: 1px solid lightgrey;
  border-radius: 2px;
}
.zp130 label {
  margin: 0 4px;
  font-size: 14px;
}
.zp130 .newtag label {
  cursor: pointer;
}
.zp130 svg {
  color: silver;
  cursor: pointer;
}
.zp130 svg:hover {
  color: grey;
}
`

$plugin({
    id: "zp130",
    props: [{
        prop: "dbf",
        type: "text",
        label: "表单字段"
    }, {
        prop: "newtag",
        type: "text",
        label: "newtag文本"
    }, {
        prop: "onAdd",
        type: "exp",
        label: "onAdd表达式"
    }, {
        prop: "onDelete",
        type: "exp",
        label: "onDelete表达式"
    }],
    render,
    css
})

const svg = {
    del: <svg className="zsvg" viewBox="64 64 896 896"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"/></svg>,
    add: <svg className="zsvg" viewBox="64 64 896 896"><path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"/><path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z"/></svg>
}