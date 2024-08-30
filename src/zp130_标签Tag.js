import React from "react"

function render(ref) {
    let arr = gets(ref)
    return <React.Fragment>
    {arr.map((a, i) => <div key={i}><label>{a}</label><span className="zdel zhover" onClick={() => del(ref, i)}/></div>)}
    {!ref.editting ? <div className="newtag" onClick={() => toAdd(ref)}><span className="zadd"/><label>{ref.props.newtag || "新标签"}</label></div> : <input onKeyDown={e => e.key == "Enter" && add(ref, e.target.value)} onBlur={e => add(ref, e.target.value)} className="zinput" autoComplete="off"/>}
    </React.Fragment>
}

function gets(ref) {
    let { dbf, form } = ref.props
    let arr
    if (form) {
        ref.form = typeof form == "string" ? ref.excA(form) : form
        if (typeof ref.form == "object") arr = ref.form[dbf]
    } else if (ref.getForm) {
        arr = ref.getForm(dbf)
    }
    return Array.isArray(arr) ? arr : []
}

function toAdd(ref) {
    ref.editting = true
    ref.render()
    setTimeout(() => ref.container.lastChild.focus())
}

function add(ref, v) {
    const { props } = ref
    if (v) {
        let arr = gets(ref)
        arr.push(v)
        ref.form ? ref.form[props.dbf] = arr : ref.setForm(props.dbf, arr)
        if (props.onAdd) ref.exc(props.onAdd, { ...ref.ctx, $x: v }, () => ref.exc("render()"))
    }
    delete ref.editting
    ref.render()
}

function del(ref, i) {
    ref.exc('confirm("确定要删除吗？")', {}, () => {
        const { props } = ref
        let arr = gets(ref)
        const $x = arr.splice(i, 1)[0]
        ref.form ? ref.form[props.dbf] = arr : ref.setForm(props.dbf, arr)
        if (ref.props.onDelete) ref.exc(ref.props.onDelete, { ...ref.ctx, $x, $index: i }, () => ref.exc("render()"))
        ref.render()
    })
}

const css = `
.zp130 {
    display: flex;
    gap: .5em;
}
.zp130 div {
    padding: 5px;
    background: #fafafa;
    border: 1px solid var(--border-color);
    border-radius: 2px;
    white-space: nowrap;
}
.zp130 label {
    margin: 0 4px;
    font-size: 14px;
}
.zp130 .zadd,
.zp130 .zdel {
    padding: 0;
    font-size: .8em;
}
.zp130 .zdel {
    color: silver;
    cursor: pointer;
}
.zp130 .newtag:hover {
    color: var(--main-color);
    border-color: var(--main-color);
}
.zp130 .newtag label {
    cursor: pointer;
}
`

$plugin({
    id: "zp130",
    props: [{
        prop: "dbf",
        label: "字段名",
        ph: "必填"
    }, {
        prop: "form",
        label: "字段容器",
        ph: "如不填则使用祖先节点的表单容器"
    }, {
        prop: "newtag",
        type: "text",
        label: "[新标签] 文本"
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