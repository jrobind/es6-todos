// create todo list using es6 js classes

// initiate store on page load
document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.querySelector('input');
    const todoVal = document.querySelector('#todoInput');
    // initiate store
    new Store();
    // setup listeners
    todoInput.addEventListener('keydown', (e) => { 
        e.stopPropagation();
        if (e.keyCode === 13) { new Todo(todoVal.value, 'high'); }
    });
});

// todo store

class Store {
    constructor(check) {
        this.todos = [];

        !check ? this.initialiseStore_() : null;
    }

    getTodoInfo_(query) {
        switch(query) {
            case 'total': 
                return this.todos.length;
            case 'total-completed': 
                return this.todos.filter(todo => todo.status).length;
            case 'total-uncompleted': 
            return this.todos.filter(todo => !todo.status).length;
        }
    }

    initialiseStore_() {
       if (!localStorage.getItem('store')) {
            localStorage.setItem('store', JSON.stringify({todos: []}));
       } else {
           // retrieve stored todos
           const todoCached = JSON.parse(localStorage.getItem('store'));
           todoCached.todos.forEach(todo => new Render(todo));
       }
    }

    updateStorage_({ id, title, status, priority, comments }) {
        const cachedTodos = JSON.parse(localStorage.getItem('store'));
        cachedTodos.todos.push({
            id,
            title,
            status,
            priority,
            comments
        })
        // set updated todos
        localStorage.setItem('store', JSON.stringify(cachedTodos));
    }

    _addTodo(todo) {
        this.todos.push(todo);
        this.updateStorage_(todo);
    }

    _removeTodo(id) {
        let i;
        this.todos.forEach((todo, index) => i = todo.id === id ? index : null);
        // remove comment using index
        this.todos.splice(i, 1);
    }

    _removeAllTodos() {
        this.todos.length = 0;
    }

    _filter({ status, priority }) {
        if (status) {
            // filter by todo staus
            const filtered = this.todos.filter(todo => todo.status === status.toLowerCase());
            // render each filtered todo to ui
            new Render(filtered);

        } else {
            // filter by todo priority
            const filtered = this.todos.filter(todo => todo.priority === priority.toLowerCase());
            // render each filtered todo to ui
            new Render(filtered);
        }
    }
}

// todo 

class Todo extends Store {
    constructor(title, priority) {
        super(true);
        this.id = this.genRandomId();
        this.title = !title ? 'Untitled' : title;
        this.status = false;
        this.priority = priority;
        this.comments = [];
        // add todo to Store
        this._addTodo(this);
        new Render(this);
    }

    genRandomId() {
        let id = '';

        for (let i = 0; i < 15; i++) {
            id += String(Math.floor(Math.random() * 11));
        }
        return Number(id);
    }

    setStatus() {
        this.status = !this.status;
    }

    setPriority(newPriority) {
        switch(newPriority) {
            case 'low': 
                this.priority = 'low';
                break;
            case 'medium': 
                this.priority = 'medium';
                break;
            case 'high': 
                this.priority = 'high';
        }
    }

    removeComment(id) {
        let i;
        this.comments.forEach((comment, index) => i = comment.id === id ? index : null);
        // remove comment using index
        this.comments.splice(i, 1);
    }

    addComment(content) {
        this.comments.push({
            id: this.genRandomId(),
            content
        });
    }

    editComment(newContent, id) {
        this.comments = this.comments.map(comment => {
            if (comment.id === id) {
                comment.content = newContent;
                return comment; 
            }

            return comment;
        });
    }
}

// render class

class Render {
    constructor(todo) {
        this.todo = todo;
        this.todoWrapper = document.querySelector('.todo-wrapper');

        if (Array.isArray(todo)) {
            this._reset();
            this.todo.forEach(todo => this.genTodoUi(todo));
        } else {
            this.genTodoUi(todo);
        }
    }

    genTodoUi({ id, title, status, priority, comments }) {
        const todoDiv = document.createElement('div');
        const _todoRemoveBtn = document.createElement('button');
        const _content = document.createElement('div');
        const _status = document.createElement('div');
        const _priority = document.createElement('div');
        const _comments = document.createElement('div');

        this._reset('input');

        // setup element classes and attributes
        this._addAttribute(todoDiv, 'uid', id);
        this._addAttribute(todoDiv, 'priority', priority);
        this._addClass(todoDiv, 'todo');
        this._addClass(_content, 'todo-content');
        this._addClass(_status, 'todo-status');
        this._addClass(_priority, 'todo-priority');
        this._addClass(_comments, 'todo-comments');

        _todoRemoveBtn.innerText = 'x';
        _content.innerHTML = title;
        _status.innerHTML = status;
        _priority.innerHTML = priority;
        _comments.innerHTML = comments;
        
        // append todo data
        [_todoRemoveBtn, _content, _status, _priority, _comments].forEach(d => todoDiv.appendChild(d));
        this.todoWrapper.appendChild(todoDiv);
    }

    _addClass(element, className) {
        element.classList.add(className);
    }

    _addAttribute(element, name, val) {
        element.setAttribute(name, val);
    }

    _reset(type) {
        if (type === 'input') {
            document.querySelector('input').value = '';
        } else {
            this.todoWrapper.innerHTML = '';
        }
    }
}