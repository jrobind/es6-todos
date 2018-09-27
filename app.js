// create todo list using es6 js classes

// todo 

class Todo {
    constructor(title, priority) {
        this.id = this.genRandomId();
        this.title = title;
        this.status = false;
        this.priority = priority;
        this.comments = [];

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
            case 'low': this.priority = 'low';
            case 'medium': this.priority = 'medium';
            case 'high': this.priority = 'high';
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

        this.genTodoUi();
    }

    genTodoUi() {
        const todoDiv = document.createElement('div');
        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = 'HELLO'

        this.todoWrapper.appendChild(contentDiv);
        const content = document.createElement('div');
        const status = document.createElement('div');
        const priority = document.createElement('div');
        const comments = document.createElement('div');
    }
}

console.log(new Todo('test', 'high'))