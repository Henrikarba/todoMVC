import { FrameWork } from "./framework/main";
import Router from "./framework/router";

const initialTodos = JSON.parse(localStorage.getItem("todos")) || [];

function TodoMVC(page) {
    const [todos, setTodos] = FrameWork.UseState(initialTodos, "todos", TodoMVC);
    const [inputValue, setInputValue] = FrameWork.UseState("", "inputValue", TodoMVC);

    if (page === undefined) {
        if (window.location.pathname === "/") {
            page = "all"
        } else if (window.location.pathname === "/active") {
            page = "active"
        } else {
            page = "completed"
        }
    }

    const addTodo = (event) => {
        const newValue = event.target.value
        setInputValue(newValue);
        if (newValue.trim() !== "") {
            setTodos([...todos, { text: newValue, completed: false }]);
            setInputValue("");
        }
    };

    const toggleTodo = (index) => {
        const updatedTodos = [...todos];
        updatedTodos[index].completed = !updatedTodos[index].completed;
        setTodos(updatedTodos);
        localStorage.setItem("todos", JSON.stringify(updatedTodos))
    };

    const removeTodo = (index) => {
        const updatedTodos = todos.filter((_, i) => i !== index);
        setTodos(updatedTodos);
        localStorage.setItem("todos", JSON.stringify(updatedTodos))
    };

    const uncheckedCount = todos.filter(todo => !todo.completed).length;

    const clearCompleted = () => {
        const completedTodos = todos.filter(todo => !todo.completed);
        setTodos(completedTodos);
    };
    const filteredTodos = todos.filter(todo => {
        localStorage.setItem("todos", JSON.stringify(todos))
        if (page === "active") {
            return !todo.completed;
        } else if (page === "completed") {
            return todo.completed;
        }
        return true;
    });

    return FrameWork.CreateElement("section", { className: "todoapp" },
        FrameWork.CreateElement("header", { className: "header" },
            FrameWork.CreateElement("h1", {}, "TodoMVC"),
            FrameWork.CreateElement("input", {
                className: "new-todo",
                type: "text",
                value: inputValue,
                onkeypress: function (event) {
                    if (event.key === "Enter") {
                        addTodo(event)
                    }
                },
                autofocus: true,
                placeholder: "What needs to be done?",
            })
        ),
        FrameWork.CreateElement("section", { className: "main" },
            FrameWork.CreateElement("ul", { className: "todo-list" },
                todos.map((todo) =>

                    FrameWork.CreateElement("li", { className: todo.completed ? "completed" : "", key: index },
                        FrameWork.CreateElement("div", { className: "view" },
                            FrameWork.CreateElement("input", {
                                className: "toggle",
                                type: "checkbox",
                                checked: todo.completed,
                                onChange: () => toggleTodo(index),
                            }),
                            FrameWork.CreateElement("label", {}, todo.text),
                            FrameWork.CreateElement("button", { className: "destroy", onClick: () => removeTodo(index) }),
                        )
                    )
                ),
                localStorage.setItem("todos", JSON.stringify(todos)),
            )
        ),
        FrameWork.CreateElement("footer", { className: "footer" },
            FrameWork.CreateElement("span", { className: "todo-count" }, `${uncheckedCount} items left`),
            FrameWork.CreateElement("ul", { className: "filters" },
                FrameWork.CreateElement("li", {},
                    FrameWork.CreateElement("a", {
                        href: "/",
                        className: page === "all" ? "selected" : "",
                    }, "All"),
                ),
                FrameWork.CreateElement("li", {},
                    FrameWork.CreateElement("a", {
                        className: page === "active" ? "selected" : "",
                        href: "/active",
                    }, "Active"),
                ),
                FrameWork.CreateElement("li", {},
                    FrameWork.CreateElement("a", {
                        className: page === "completed" ? "selected" : "",
                        href: "/completed",
                    }, "Completed")
                )
            ),
            FrameWork.CreateElement("button", { className: todos.length !== 0 ? "clear-completed" : "clear-completed hidden", onClick: clearCompleted }, "Clear Completed")
        )
    );
}

const container = document.getElementById("app");
const router = new Router(container);
router.registerRoute('/', () => TodoMVC("all"));
router.registerRoute('/active', () => TodoMVC("active"));
router.registerRoute('/completed', () => TodoMVC("completed"));
router.handleRouteChange();