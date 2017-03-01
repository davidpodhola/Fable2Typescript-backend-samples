import classnames_js from "../lib/classnames.js";
import director_js from "../lib/director.js";
import { toString, extendInfo, Array as _Array, compareRecords, equalsRecords, defaultArg } from "fable-core/Util";
import { setType } from "fable-core/Symbol";
import _Symbol from "fable-core/Symbol";
import { fold, filter, map, toList, iterate } from "fable-core/Seq";
import { trim, newGuid } from "fable-core/String";
import { createElement, Component } from "react";
import { render as render_1 } from "react-dom";
export const classNames = classnames_js;
export const Router = director_js;
export const Util = function (__exports) {
    const load = __exports.load = function (key) {
        return defaultArg(localStorage.getItem(key), null, $var1 => (value => value)((arg00 => JSON.parse(arg00))($var1)));
    };

    const save = __exports.save = function (key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    };

    return __exports;
}({});
export class Todo {
    constructor(id, title, completed) {
        this.id = id;
        this.title = title;
        this.completed = completed;
    }

    [_Symbol.reflection]() {
        return {
            type: "React-todomvc.Todo",
            interfaces: ["FSharpRecord", "System.IEquatable", "System.IComparable"],
            properties: {
                id: "string",
                title: "string",
                completed: "boolean"
            }
        };
    }

    Equals(other) {
        return equalsRecords(this, other);
    }

    CompareTo(other) {
        return compareRecords(this, other);
    }

}
setType("React-todomvc.Todo", Todo);
export class TodoModel {
    [_Symbol.reflection]() {
        return {
            type: "React-todomvc.TodoModel",
            properties: {
                key: "string",
                onChanges: _Array("function"),
                todos: _Array(Todo)
            }
        };
    }

    constructor(key) {
        this["key@"] = key;
        this["todos@"] = defaultArg(Util.load(key), []);
        this["onChanges@"] = [];
    }

    get key() {
        return this["key@"];
    }

    get todos() {
        return this["todos@"];
    }

    set todos(v) {
        this["todos@"] = v;
    }

    get onChanges() {
        return this["onChanges@"];
    }

    set onChanges(v) {
        this["onChanges@"] = v;
    }

    subscribe(onChange) {
        this.onChanges = [onChange];
    }

    inform() {
        Util.save(this.key, this.todos);
        iterate(cb => {
            cb(null);
        }, this.onChanges);
    }

    addTodo(title) {
        this.todos = this.todos.concat([new Todo(newGuid(), title, false)]);
        this.inform();
    }

    toggleAll(checked_) {
        this.todos = this.todos.map(todo => new Todo(todo.id, todo.title, checked_));
        this.inform();
    }

    toggle(todoToToggle) {
        this.todos = this.todos.map(todo => {
            if (todo.id !== todoToToggle.id) {
                return todo;
            } else {
                const completed = !todo.completed;
                return new Todo(todo.id, todo.title, completed);
            }
        });
        this.inform();
    }

    destroy(todoToDestroy) {
        this.todos = this.todos.filter(todo => todo.id !== todoToDestroy.id);
        this.inform();
    }

    save(todoToSave, text) {
        this.todos = this.todos.map(todo => todo.id !== todoToSave.id ? todo : new Todo(todo.id, text, todo.completed));
        this.inform();
    }

    clearCompleted() {
        this.todos = this.todos.filter(todo => !todo.completed);
        this.inform();
    }

}
setType("React-todomvc.TodoModel", TodoModel);
export const ESCAPE_KEY = 27;
export const ENTER_KEY = 13;
export const ALL_TODOS = "all";
export const ACTIVE_TODOS = "active";
export const COMPLETED_TODOS = "completed";
export class TodoItem extends Component {
    [_Symbol.reflection]() {
        return extendInfo(TodoItem, {
            type: "React-todomvc.TodoItem",
            interfaces: [],
            properties: {}
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            editText: props.todo.title
        };
        this.editField = null;
    }

    handleSubmit(e) {
        const matchValue = trim(this.state.editText, "both");

        if (matchValue.length > 0) {
            this.props.onSave(matchValue);
            this.setState({
                editText: matchValue
            });
        } else {
            this.props.onDestroy(e);
        }
    }

    handleEdit(ev) {
        this.props.onEdit(ev);
        this.setState({
            editText: this.props.todo.title
        });
    }

    handleKeyDown(e) {
        const matchValue = e.which;

        switch (matchValue) {
            case 27:
                this.setState({
                    editText: this.props.todo.title
                });
                this.props.onCancel(e);
                break;

            case 13:
                this.handleSubmit(e);
                break;

            default:}
    }

    handleChange(e) {
        if (this.props.editing) {
            this.setState({
                editText: toString(e.target.value)
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (!(nextProps.todo === this.props.todo) ? true : nextProps.editing !== this.props.editing) {
            return true;
        } else {
            return nextState.editText !== this.state.editText;
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.editing ? this.props.editing : false) {
            const matchValue = this.editField;

            if (matchValue != null) {
                matchValue.focus();
                matchValue.setSelectionRange(matchValue.value.length, matchValue.value.length);
            }
        }
    }

    render() {
        const className = classNames({
            completed: this.props.todo.completed,
            editing: this.props.editing
        });
        return createElement("li", {
            className: className
        }, createElement("div", {
            className: "view"
        }, createElement("input", {
            className: "toggle",
            type: "checkbox",
            checked: this.props.todo.completed,
            onChange: e => {
                this.props.onToggle(e);
            }
        }), createElement("label", {
            onDoubleClick: arg00 => {
                this.handleEdit(arg00);
            }
        }, this.props.todo.title), createElement("button", {
            className: "destroy",
            onClick: e_1 => {
                this.props.onDestroy(e_1);
            }
        })), createElement("input", {
            className: "edit",
            ref: x => {
                this.editField = x;
            },
            value: this.state.editText,
            onBlur: arg00_3 => {
                this.handleSubmit(arg00_3);
            },
            onChange: arg00_2 => {
                this.handleChange(arg00_2);
            },
            onKeyDown: arg00_1 => {
                this.handleKeyDown(arg00_1);
            }
        }));
    }

}
setType("React-todomvc.TodoItem", TodoItem);
export function TodoFooter(props) {
    const activeTodoWord = "item" + (props.count === 1 ? "" : "s");
    const clearButton = props.completedCount > 0 ? createElement("button", {
        className: "clear-completed",
        onClick: props.onClearCompleted
    }, "Clear completed") : null;

    const className = category => {
        return classNames({
            selected: props.nowShowing === category
        });
    };

    return createElement("footer", {
        className: "footer"
    }, createElement("span", {
        className: "todo-count"
    }, createElement("strong", {}, String(props.count)), " " + activeTodoWord + " left"), createElement("ul", {
        className: "filters"
    }, createElement("li", {}, createElement("a", {
        href: "#/",
        className: className("all")
    }, "All")), " ", createElement("li", {}, createElement("a", {
        href: "#/active",
        className: className("active")
    }, "Active")), " ", createElement("li", {}, createElement("a", {
        href: "#/completed",
        className: className("completed")
    }, "Completed")), clearButton));
}
export class TodoApp extends Component {
    [_Symbol.reflection]() {
        return extendInfo(TodoApp, {
            type: "React-todomvc.TodoApp",
            interfaces: [],
            properties: {}
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            nowShowing: "all",
            editing: null,
            newTodo: ""
        };
    }

    componentDidMount() {
        const nowShowing = category => () => {
            this.setState((() => {
                const inputRecord = this.state;
                return {
                    nowShowing: category,
                    editing: inputRecord.editing,
                    newTodo: inputRecord.newTodo
                };
            })());
        };

        const router = Router({
            ["/"]: nowShowing("all"),
            ["/active"]: nowShowing("active"),
            ["/completed"]: nowShowing("completed")
        });
        return router.init("/");
    }

    handleChange(ev) {
        this.setState((() => {
            const inputRecord = this.state;
            const newTodo = toString(ev.target.value);
            return {
                nowShowing: inputRecord.nowShowing,
                editing: inputRecord.editing,
                newTodo: newTodo
            };
        })());
    }

    handleNewTodoKeyDown(ev) {
        if (ev.keyCode === 13) {
            ev.preventDefault();
            const v = trim(this.state.newTodo, "both");

            if (v.length > 0) {
                this.props.model.addTodo(v);
                this.setState((() => {
                    const inputRecord = this.state;
                    const newTodo = "";
                    return {
                        nowShowing: inputRecord.nowShowing,
                        editing: inputRecord.editing,
                        newTodo: newTodo
                    };
                })());
            }
        }
    }

    toggleAll(ev) {
        this.props.model.toggleAll(ev.target.checked);
    }

    toggle(todoToToggle) {
        this.props.model.toggle(todoToToggle);
    }

    destroy(todo) {
        this.props.model.destroy(todo);
    }

    edit(todo) {
        this.setState((() => {
            const inputRecord = this.state;
            const editing = todo.id;
            return {
                nowShowing: inputRecord.nowShowing,
                editing: editing,
                newTodo: inputRecord.newTodo
            };
        })());
    }

    save(todoToSave, text) {
        this.props.model.save(todoToSave, text);
        this.setState((() => {
            const inputRecord = this.state;
            const editing = null;
            return {
                nowShowing: inputRecord.nowShowing,
                editing: editing,
                newTodo: inputRecord.newTodo
            };
        })());
    }

    cancel() {
        this.setState((() => {
            const inputRecord = this.state;
            const editing = null;
            return {
                nowShowing: inputRecord.nowShowing,
                editing: editing,
                newTodo: inputRecord.newTodo
            };
        })());
    }

    clearCompleted() {
        this.props.model.clearCompleted();
    }

    render() {
        const todos = this.props.model.todos;
        const todoItems = toList(map(todo => createElement(TodoItem, (() => {
            const onToggle = _arg1 => {
                this.toggle(todo);
            };

            const onDestroy = _arg2 => {
                this.destroy(todo);
            };

            const onEdit = _arg3 => {
                this.edit(todo);
            };

            return {
                key: todo.id,
                todo: todo,
                editing: (() => {
                    const matchValue = this.state.editing;

                    if (matchValue == null) {
                        return false;
                    } else {
                        return matchValue === todo.id;
                    }
                })(),
                onSave: text => {
                    this.save(todo, text);
                },
                onEdit: onEdit,
                onDestroy: onDestroy,
                onCancel: _arg4 => {
                    this.cancel();
                },
                onToggle: onToggle
            };
        })()), filter(todo_1 => {
            const matchValue_1 = this.state.nowShowing;

            switch (matchValue_1) {
                case "active":
                    return !todo_1.completed;

                case "completed":
                    return todo_1.completed;

                default:
                    return true;
            }
        }, todos)));
        const activeTodoCount = fold((accum, todo_2) => todo_2.completed ? accum : accum + 1, 0, todos);
        const completedCount = todos.length - activeTodoCount;
        const footer = (activeTodoCount > 0 ? true : completedCount > 0) ? createElement(props => TodoFooter(props), (() => {
            const nowShowing = this.state.nowShowing;
            return {
                count: activeTodoCount,
                completedCount: completedCount,
                onClearCompleted: _arg5 => {
                    this.clearCompleted();
                },
                nowShowing: nowShowing
            };
        })()) : null;
        const main = todos.length > 0 ? createElement("section", {
            className: "main"
        }, createElement("input", {
            className: "toggle-all",
            type: "checkbox",
            onChange: arg00 => {
                this.toggleAll(arg00);
            },
            checked: activeTodoCount === 0
        }), createElement("ul", {
            className: "todo-list"
        }, ...todoItems)) : null;
        return createElement("div", {}, createElement("header", {
            className: "header"
        }, createElement("h1", {}, "todos"), createElement("input", {
            className: "new-todo",
            placeholder: "What needs to be done?",
            value: this.state.newTodo,
            onKeyDown: arg00_2 => {
                this.handleNewTodoKeyDown(arg00_2);
            },
            onChange: arg00_1 => {
                this.handleChange(arg00_1);
            },
            autoFocus: true
        })), main, footer);
    }

}
setType("React-todomvc.TodoApp", TodoApp);
export const model = new TodoModel("react-todos");
export function render() {
    render_1(createElement(TodoApp, {
        model: model
    }), document.getElementsByClassName("todoapp")[0]);
}
model.subscribe(() => {
    render();
});
render();
export function add(x, y) {
    return x + y;
}
//# sourceMappingURL=react-todomvc.js.map