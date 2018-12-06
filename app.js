// create todo list using es6 js classes

// initiate store on page load
document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.querySelector('input');
    const todoVal = document.querySelector('#todoInput');
    const removeBtn = document.querySelector('.remove-btn');

    // initiate store
    window.store = new Store();

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

        !check ? this._initialiseStore() : null;
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

    _initialiseStore() {
       if (!localStorage.getItem('store')) {
            localStorage.setItem('store', JSON.stringify({todos: []}));
       } else {
           // retrieve stored todos
           const todoCached = JSON.parse(localStorage.getItem('store'));
           todoCached.todos.length ? todoCached.todos.forEach(todo => new Render(todo)) : null;
           // update store
           this.todos = todoCached.todos;
       }
    }

    _updateStorage(todos) {
        let cachedTodos = JSON.parse(localStorage.getItem('store'));

        if (!Array.isArray(todos)) {
            const { id, title, status, priority, comments } = todos;
            cachedTodos.todos.push({
                id,
                title,
                status,
                priority,
                comments
            })
            // set updated todos
            localStorage.setItem('store', JSON.stringify(cachedTodos));
        } else {
            cachedTodos.todos = todos;
            localStorage.setItem('store', JSON.stringify(cachedTodos));
        }
    }

    _addTodo(todo) {
        this.todos.push(todo);
        this._updateStorage(todo);
    }

    _removeTodo(id) {
        for (let i = this.todos.length -1; i >= 0; i--) {
            if (this.todos[i].id === Number(id)) {
                this.todos.splice(i, 1);
            }
        }

        this._updateStorage(this.todos);
        // render updated todos
        new Render(this.todos);
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
        // add todo to store
        store._addTodo(this);
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

class Render extends Store {
    constructor(todo) {
        super(true);

        this.todoWrapper = document.querySelector('.todo-wrapper');
        this.todo = todo;

        if (Array.isArray(todo)) {
            this._reset();
            // stop if todos array is empty
            todo.length ? this.todo.forEach(todo => this.genTodoUi(todo)) : null;

            if (!todo.length) {
                this._toggleAttribute(this.todoWrapper, 'show', 'remove');
                this._toggleAttribute(this.todoWrapper, 'hide', 'add', 'true');
            }
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
        this._toggleAttribute(todoDiv, 'uid', 'add', id,);
        this._toggleAttribute(todoDiv, 'priority', 'add', priority);
        this._toggleClass(_todoRemoveBtn, 'remove-btn', 'add');
        this._toggleClass(todoDiv, 'todo', 'add');
        this._toggleClass(_content, 'todo-content', 'add');
        this._toggleClass(_status, 'todo-status', 'add');
        this._toggleClass(_priority, 'todo-priority', 'add');
        this._toggleClass(_comments, 'todo-comments', 'add');

        // setup listeners
        _todoRemoveBtn.addEventListener('click', (e) => store._removeTodo(e.currentTarget.parentElement.getAttribute('uid')));

        _todoRemoveBtn.innerText = 'x';
        _content.innerHTML = title;
        _status.innerHTML = status;
        _priority.innerHTML = priority;
        _comments.innerHTML = comments;
        
        // append todo data
        [_todoRemoveBtn, _content, _status, _priority, _comments].forEach(d => todoDiv.appendChild(d));

        // set attribute to todo-wrapper so we can toggle its display
        if ( typeof store !== 'undefined') {
            this._toggleAttribute(this.todoWrapper, 'hide', 'remove');
            this._toggleAttribute(this.todoWrapper, 'show', 'add', 'true');
        }

        this.todoWrapper.appendChild(todoDiv);
    }

    _toggleClass(element, className, toggle) {
       toggle === 'add' ? element.classList.add(className) : element.classList.remove(className);
    }

    _toggleAttribute(element, name, toggle, val) {
        toggle === 'add' ? element.setAttribute(name, val) : element.removeAttribute(name);
    }

    _reset(type) {
        if (type === 'input') {
            document.querySelector('input').value = '';
        } else {
            this.todoWrapper.innerHTML = '';
        }
    }
}