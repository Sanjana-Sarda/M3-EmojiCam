const Keyboard = {
    elements: {
        main: null,
        keysContainer: null,
        keys: []

    },

    eventHandlers: {
        oninput: null,
        onclose: null,
        left: null,
        right: null
    },

    properties: {
        value: "",
        capsLock: false,
        keyv: [
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 0, 1, 0,
            0, 1, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 1, 0,
            0, 1, 0, 0,
        ]
    },

    init() {
        //Create main elements
        this.elements.main = document.createElement("div");
        this.elements.keysContainer = document.createElement("div");

        //Setup main elements
        this.elements.main.classList.add("keyboard", "keyboard-hidden");
        this.elements.keysContainer.classList.add("keyboard__keys");
        this.elements.keysContainer.appendChild(this._createKeys());
        this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");
        
        //Add to DOM
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        //Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll(".use-keyboard-input").forEach(element => {
            element.addEventListener("focus", () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });

    },


    _createKeys() {
        const fragment = document.createDocumentFragment();


        const keyLayout = [
            "keyboard_return", "backspace", ".", "c", "a", "b", "d", "e", "f",
            "left", "h", "i", "g", "k", "l", "j", "n", "o", "m", "right",
            "q", "r", "s", "p", "v", "t", "u", "x", "y", "w", "z",
            "space", "done"
        ];

        


        //Creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        var prevKey = "";

        keyLayout.forEach(key => {
            const keyElement = document.createElement("button");
            //const insertLineBreak = [13, 28, 45].includes(keyLayout.indexOf(prevKey));
            const insertLineBreak = ["f", "right", "z"].indexOf(key) !== -1;


            //Add attributes/classes
            keyElement.setAttribute("type", "button");
            keyElement.classList.add("keyboard__key", "keyboard__key--hidden");

            switch (key) {
                case "backspace":
                   keyElement.classList.add("keyboard__key--wide");
                   if (this.properties.keyv[keyLayout.indexOf(key)]===1) {
                        keyElement.classList.add("keyboard__key--show");
                    }
                   keyElement.innerHTML = createIconHTML("backspace");
                   
                   keyElement.addEventListener("click", () => {
                       this.properties.value = this.properties.value.substring(0, this.properties.value.length -1);
                       this._triggerEvent("oninput");
                   });
                   break;

                case "keyboard_capslock":
                   keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
                   if (this.properties.keyv[keyLayout.indexOf(key)]===1) {
                       keyElement.classList.add("keyboard__key--show");
                    }
                   keyElement.innerHTML = createIconHTML("keyboard_capslock");
                   
                   keyElement.addEventListener("click", () => {
                       this._toggleCapsLock();
                       keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
                   });
                   break;

                case "keyboard_return":
                    keyElement.classList.add("keyboard__key--wide");
                    if (this.properties.keyv[keyLayout.indexOf(key)]===1) {
                        keyElement.classList.add("keyboard__key--show");
                     }
                    keyElement.innerHTML = createIconHTML("keyboard_return");
                    
                    keyElement.addEventListener("click", () => {
                        this.properties.value += "\n";
                        this._triggerEvent("oninput");
                    });
                    break;

                case "left":
                    keyElement.classList.add("keyboard__key--mid-wide", "keyboard__key--show");
                    keyElement.innerHTML = createIconHTML("chevron_left");
                    
                    keyElement.addEventListener("click", () => {
                        this._left(keyLayout);
                        this._triggerEvent("left");
                    });
                    break;

                case "right":
                    keyElement.classList.add("keyboard__key--mid-wide", "keyboard__key--show");
                    keyElement.innerHTML = createIconHTML("chevron_right");
                    
                    keyElement.addEventListener("click", () => {
                        this._right(keyLayout);
                        this._triggerEvent("right");
                    });
                    break;

                case "space":
                    keyElement.classList.add("keyboard__key--extra-wide", "keyboard__key--show");
                    keyElement.innerHTML = createIconHTML("space_bar");
                        
                    keyElement.addEventListener("click", () => {
                        this.properties.value += " ";
                        this._triggerEvent("oninput");
                    });
                    break;
                
                case "done":
                    keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark", "keyboard__key--show");
                    keyElement.innerHTML = createIconHTML("check_circle");
                            
                    keyElement.addEventListener("click", () => {
                        this.close();
                        this._triggerEvent("onclose");
                    });
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();

                    if (this.properties.keyv[keyLayout.indexOf(key)]===1) {
                        keyElement.classList.add("keyboard__key--show");
                    }
                            
                    keyElement.addEventListener("click", () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvent("oninput");
                    });
                    break;
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak) {
                fragment.appendChild(document.createElement("br"));
            }

            prevKey = key;
        });

        return fragment;

    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;
        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    _left(keyLayout){
        for (const key of this.elements.keys) {
            if(this.properties.keyv[keyLayout.indexOf(key.innerText)]) {
                key.classList.remove("keyboard__key--show");
            }
        }
        if (this.properties.keyv[21]===1) {
            this.properties.keyv[21] = 0;
            this.properties.keyv[20] = 1; 
        }
        else if (this.properties.keyv[20]===1) {
            this.properties.keyv = [
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
                0, 0, 1, 0,
                0, 1, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 1, 0,
                0, 1, 0, 0,
            ];
        }
        else if (this.properties.keyv[30]===1) {
            this.properties.keyv[30] = 0;
            this.properties.keyv[29] = 1; 
        }
        else {
            for (i = 0; i<this.properties.keyv.length; i++) {
                if (this.properties.keyv[i]===1) {
                    this.properties.keyv[i] = 0;
                    this.properties.keyv[i-1] = 1;
                }
            }
        }
        
        for (const key of this.elements.keys) {
            if(this.properties.keyv[keyLayout.indexOf(key.innerText)]) {
                key.classList.add("keyboard__key--show");
            }
        }
    },

    _right(keyLayout) {
        for (const key of this.elements.keys) {
            if(this.properties.keyv[keyLayout.indexOf(key.innerText)]) {
                key.classList.remove("keyboard__key--show");
            }
        }

        if (this.properties.keyv[29]===1) {
            this.properties.keyv[29] = 0;
            this.properties.keyv[30] = 1; 
        }
        else if (this.properties.keyv[30]===1) {
            this.properties.keyv = [
                0, 1, 0,
                0, 1, 0,
                0, 1, 0,
                0, 0, 1, 0,
                0, 1, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 1, 0,
                0, 1, 0, 0,
            ];
        }
        else if (this.properties.keyv[20]===1) {
            this.properties.keyv[20] = 0;
            this.properties.keyv[21] = 1; 
        }
        else {
            for (j = 0; j<this.properties.keyv.length -1; j++) {
                if (this.properties.keyv[j]===1) {
                    this.properties.keyv[j] = 0;
                    this.properties.keyv[j+1] = 2;
                }
            }
            for (j = 0; j<this.properties.keyv.length -1; j++) {
                if (this.properties.keyv[j]===2) {
                    this.properties.keyv[j] = 1;
                }
            }
        }

        for (const key of this.elements.keys) {
            if(this.properties.keyv[keyLayout.indexOf(key.innerText)]) {
                key.classList.add("keyboard__key--show");
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove("keyboard--hidden");
    },
    
    close() {
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add("keyboard--hidden");
    }

    
};

window.addEventListener("DOMContentLoaded", function() {
    Keyboard.init();
});