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

    return FrameWork.CreateElement("div", {},
        FrameWork.CreateElement("h1", {}, "TodoMVC"),
        FrameWork.CreateElement("div", {},
            FrameWork.CreateElement("input", {
                type: "text",
                value: inputValue,
                onkeypress: function (event) {
                    if (event.key === "Enter") {
                        addTodo(event)
                    }
                },
                placeholder: "Add a new todo",
            })
        ),
        FrameWork.CreateElement("ul", {},
            filteredTodos.map((todo, index) =>
                FrameWork.CreateElement("li", { key: index },
                    FrameWork.CreateElement("input", {
                        type: "checkbox",
                        checked: todo.completed,
                        onChange: () => toggleTodo(index),
                    }),
                    FrameWork.CreateElement("span", {}, todo.text),
                    FrameWork.CreateElement("button", { onClick: () => removeTodo(index) }, "Remove"),
                )
            )
        ),
        FrameWork.CreateElement("div", { className: "footer" },
            FrameWork.CreateElement("p", {}, `${uncheckedCount} items left`),
            FrameWork.CreateElement("button", {
                onClick: () => setActiveFilter("all"),
                className: filter === "all" ? "active" : ""
            }, "All"),
            FrameWork.CreateElement("button", {
                onClick: () => setActiveFilter("active"),
                className: filter === "active" ? "active" : ""
            }, "Active"),
            FrameWork.CreateElement("button", {
                onClick: () => setActiveFilter("completed"),
                className: filter === "completed" ? "active" : ""
            }, "Completed"),
            FrameWork.CreateElement("button", { onClick: clearCompleted }, "Clear Completed")
        )
    );
}

const container = document.getElementById("app");
const router = new Router(container);
router.registerRoute('/', () => TodoMVC());
router.handleRouteChange();