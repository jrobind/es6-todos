// create todo list using es6 js classes

// initiate store on page load
document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.querySelector('input');
    const todoVal = document.querySelector('#todoInput');

    // initiate store
    window.store = new Store();
    // initiate widget
    new Widget();
    // initiate filter menu
    new TodoMenu();

    // setup listeners
    todoInput.addEventListener('keydown', (e) => { 
        e.stopPropagation();
        if (e.keyCode === 13) { new Todo(todoVal.value, 'high'); }
    });
});

// util class

class Util {
    _toggleClass(element, className, toggle) {
        toggle === 'add' ? element.classList.add(className) : element.classList.remove(className);
     }
 
     _toggleAttribute(element, name, toggle, val) {
         toggle === 'add' ? element.setAttribute(name, val) : element.removeAttribute(name);
     }
}

// todo store

class Store extends Util {
    constructor(check) {
        super();

        this.todos = [];
        !check ? this._initialiseStore() : null;
    }

    getTodoInfo_(query) {
        switch(query) {
            case 'total': 
                return store.todos.length;
            case 'total-completed': 
                return store.todos.filter(todo => todo.status).length;
            case 'total-uncompleted': 
                return store.todos.filter(todo => !todo.status).length;
            case 'low-priority': 
                return store.todos.filter(todo => todo.priority === 'low').length;
            case 'medium-priority': 
                return store.todos.filter(todo => todo.priority === 'medium').length;
            case 'high-priority': 
                return store.todos.filter(todo => todo.priority === 'high').length;
        }
    }

    _initialiseStore() {
       if (!localStorage.getItem('store')) {
            localStorage.setItem('store', JSON.stringify({todos: []}));
       } else {
           // retrieve stored todos
           const todoCached = JSON.parse(localStorage.getItem('store'));
           todoCached.todos.length ? new Render(todoCached.todos) : null;
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
        this._forceTrigger();
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
        this._forceTrigger();
    }

    _removeAllTodos() {
        this.todos.length = 0;
    }

    _forceTrigger() {
        // close the widget, if open
        document.querySelector('#widgetBtn').dispatchEvent(new CustomEvent('click', {'detail': 'terminate'}));
    }

    _filter({ status, priority, all }) {
        if (status || !status || all) {
            // filter by todo status
            const filtered = status ? store.todos.filter(todo => todo.status === status) : store.todos;
            // render each filtered todo to ui
            new Render(filtered);

        } else {
            // filter by todo priority
            const filtered = store.todos.filter(todo => todo.priority === priority.toLowerCase());
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
        this.todoMenu = document.querySelector('.todo-menu');
        this.todo = todo;

        if (this.todoMenu && this.todoMenu.hasAttribute('active') && !todo.length) {
            this._reset();
            this._genTodoUi(todo);
            return;
        }

        if (Array.isArray(todo)) {
            this._reset();
            // stop if todos array is empty
            todo.length ? this.todo.forEach(todo => this._genTodoUi(todo)) : null;

            if (!todo.length) {
                this._toggleAttribute(this.todoWrapper, 'show', 'remove');
                this._toggleAttribute(this.todoWrapper, 'hide', 'add', 'true');
            } else {
                this._toggleAttribute(this.todoWrapper, 'hide', 'remove');
                this._toggleAttribute(this.todoWrapper, 'show', 'add', 'true');
            }

        } else {
            this._genTodoUi(todo);
        }
    }

    _genTodoUi({ id, title, status, priority, comments }) {
        const todoDiv = document.createElement('div');
        const todoRemoveBtn = document.createElement('button');
        const content = document.createElement('div');
        const todoStatus = document.createElement('div');
        const todoPriority = document.createElement('div');
        const todoComments = document.createElement('div');

        this._reset('input');
        !this.todoMenu ? new TodoMenu() : null;

        // setup element classes and attributes
        this._toggleAttribute(todoDiv, 'uid', 'add', id,);
        this._toggleAttribute(todoDiv, 'priority', 'add', priority);
        this._toggleClass(todoRemoveBtn, 'remove-btn', 'add');
        this._toggleClass(todoDiv, 'todo', 'add');
        this._toggleClass(content, 'todo-content', 'add');
        this._toggleClass(todoStatus, 'todo-status', 'add');
        this._toggleClass(todoPriority, 'todo-priority', 'add');
        this._toggleClass(todoComments, 'todo-comments', 'add');

        // setup listeners
        todoRemoveBtn.addEventListener('click', (e) => store._removeTodo(e.currentTarget.parentElement.getAttribute('uid')));

        todoRemoveBtn.innerText = 'x';
        content.innerHTML = title;
        todoStatus.innerHTML = status;
        todoPriority.innerHTML = priority;
        todoComments.innerHTML = comments;
        
        // append todo data
        [todoRemoveBtn, content, todoStatus, todoPriority, todoComments].forEach(d => todoDiv.appendChild(d));

        // set attribute to todo-wrapper so we can toggle its display
        if ( typeof store !== 'undefined') {
            this._toggleAttribute(this.todoWrapper, 'hide', 'remove');
            this._toggleAttribute(this.todoWrapper, 'show', 'add', 'true');
        }

        this.todoWrapper.appendChild(todoDiv);
    }

    _reset(type) {
        if (type === 'input') {
            document.querySelector('input').value = '';
        } else {
            this.todoWrapper.innerHTML = '';
        }
    }
}

// filter menu class

class TodoMenu extends Store {
    constructor() {
        super(true);

        this.todoWrapper = document.querySelector('.todo-wrapper');
        this.todoMenu = document.querySelector('.todo-menu');
        this._genTodoMenu();
    }
    _genTodoMenu() {
        const todoMenu = document.createElement('div');
        const all = document.createElement('div');
        const active = document.createElement('div');
        const completed = document.createElement('div');
    
        this._toggleClass(todoMenu, 'todo-menu', 'add');
    
        all.innerText = 'All';
        active.innerText = 'Active';
        completed.innerText = 'Completed';
        
        [all, active, completed].forEach(el => {
            el.addEventListener('click', (e) => {
                const value = e.currentTarget.innerText;
                switch(value) {
                    case 'All':
                        this._filter({all: true});
                        break;
                    case 'Active':
                        this._filter({status: false});
                        break;
                    case 'Completed':
                        this._filter({status: true});
                        break;
                }
            });
    
            todoMenu.appendChild(el);
        });
        // append menu to todo wrapper
        this.todoWrapper.appendChild(todoMenu);
    }
}

// data widget class

class Widget extends Store {
    constructor() {
        super();

        this.widgetEl = document.querySelector('.info-widget');
        this.widgetBtn = document.querySelector('#widgetBtn');
        this.infoWidgetTodos = document.querySelector('.info-widget-todos');
        this.infoWidgetCompleted = document.querySelector('.info-widget-completed');
        this.infoWidgetUncompleted = document.querySelector('.info-widget-uncompleted');
        this.infoWidgetLow = document.querySelector('.info-widget-low');
        this.infoWidgetMedium = document.querySelector('.info-widget-medium');
        this.infoWidgetHigh = document.querySelector('.info-widget-high');
        // append html entity
        this.widgetBtn.innerHTML = '&lt;';
        // setup listener
        this.widgetBtn.addEventListener('click', this._handleWidgetClick.bind(this));
    }

    _handleWidgetClick(e) {
        // populate with current todo data
        this._populateWidgetData();
        // if event is manually dispatched we wish to update data but not class names
        if (e.detail === 'terminate') { return }
        if (this.widgetEl.classList.contains('hide')) {
            this.widgetBtn.innerHTML = '&gt;';

            this._toggleClass(this.widgetEl, 'hide', 'remove');
            this._toggleClass(this.widgetEl, 'show', 'add');
        } else {
            this.widgetBtn.innerHTML = '&lt;';

            this._toggleClass(this.widgetEl, 'show', 'remove');
            this._toggleClass(this.widgetEl, 'hide', 'add');
        }
    }

    _populateWidgetData() {
        const infoElStr = ['total', 'total-completed', 'total-uncompleted', 'low-priority', 'medium-priority', 'high-priority'];
        const infoEls = [this.infoWidgetTodos, this.infoWidgetCompleted, this.infoWidgetUncompleted, this.infoWidgetLow, this.infoWidgetMedium, this.infoWidgetHigh];
        const vals = infoElStr.map(el => this.getTodoInfo_(el));
        // render todo info
        vals.forEach((val, i) => {
            if (val !== undefined) {
                infoEls[i].innerText = val;
            } 
        });
    }
}