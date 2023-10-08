// Import the framework
import { FrameWork } from "./framework/main";
import Router from "./framework/router";

// Create a component for the TodoMVC application
function TodoMVC() {
    const [todos, setTodos] = FrameWork.UseState([], "todos");
    const [inputValue, setInputValue] = FrameWork.UseState("", "inputValue");

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const addTodo = () => {
        if (inputValue.trim() !== "") {
            setTodos([...todos, { text: inputValue, completed: false }]);
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

    return FrameWork.CreateElement("div", {},
        FrameWork.CreateElement("h1", {}, "TodoMVC"),
        FrameWork.CreateElement("div", {},
            FrameWork.CreateElement("input", {
                type: "text",
                value: inputValue,
                onInput: handleInputChange,
                placeholder: "Add a new todo",
            }),
            FrameWork.CreateElement("button", { onClick: addTodo }, "Add"),
        ),
        FrameWork.CreateElement("ul", {},
            todos.map((todo, index) =>
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
        )
    );
}

// Initialize the framework and render the TodoMVC component
const container = document.getElementById("app");
const router = new Router(container);
router.registerRoute('/', () => TodoMVC());
router.handleRouteChange();