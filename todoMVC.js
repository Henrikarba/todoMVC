import { FrameWork } from "./framework/main";
import Router from "./framework/router";

function TodoMVC() {
    const [todos, setTodos] = FrameWork.UseState([], "todos", TodoMVC);
    const [inputValue, setInputValue] = FrameWork.UseState("", "inputValue", TodoMVC);
    const [filter, setFilter] = FrameWork.UseState("all", "filter", TodoMVC);

    const filteredTodos = todos.filter(todo => {
        if (filter === "active") {
            return !todo.completed;
        } else if (filter === "completed") {
            return todo.completed;
        }
        return true;
    });

    const setActiveFilter = (selectedFilter) => {
        setFilter(selectedFilter);
    };

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
    };

    const removeTodo = (index) => {
        const updatedTodos = todos.filter((_, i) => i !== index);
        setTodos(updatedTodos);
    };

    const uncheckedCount = todos.filter(todo => !todo.completed).length;

    const clearCompleted = () => {
        const completedTodos = todos.filter(todo => !todo.completed);
        setTodos(completedTodos);
    };

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
                filteredTodos.map((todo, index) =>
                    FrameWork.CreateElement("li", { key: index },
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

                )
            )
        ),
        FrameWork.CreateElement("div", { className: "footer" },
            FrameWork.CreateElement("span", { className: "todo-count" }, `${uncheckedCount} items left`),
            FrameWork.CreateElement("ul", { className: "filters" },
                FrameWork.CreateElement("li", {},
                    FrameWork.CreateElement("a", {
                        className: "selected",
                        onClick: () => setActiveFilter("all"),
                        className: filter === "all" ? "active" : ""
                    }, "All"),
                ),
                FrameWork.CreateElement("li", {},
                    FrameWork.CreateElement("a", {
                        onClick: () => setActiveFilter("active"),
                        className: filter === "active" ? "active" : ""
                    }, "Active"),
                ),
                FrameWork.CreateElement("li", {},
                    FrameWork.CreateElement("a", {
                        onClick: () => setActiveFilter("completed"),
                        className: filter === "completed" ? "active" : ""
                    }, "Completed")
                )
            ),
            FrameWork.CreateElement("button", { className: "clear-completed", onClick: clearCompleted }, "Clear Completed")

        )
    );
}

const container = document.getElementById("app");
const router = new Router(container);
router.registerRoute('/', () => TodoMVC());
router.handleRouteChange();