
import gsap from 'gsap';

export default defineNuxtPlugin((NuxtApp) => {
  class Toast {
    constructor({id, message, color}) {
      this.id = id;
      this.message = message;
      this.color = color;
      this.timmer = 2000;
      this.timeouts = [];
  
      const hastToast = this.checkIfToastExists();
      if(!hastToast) this.createToast();
    }
    
  
    checkIfToastExists() {
      const toast = document.querySelector(`#${this.id}`);
      if (toast) return true
    }
  
    createToast() {
      const toastContainer = document.createElement("div");
  
      toastContainer.classList.add('toast', 'absolute', 'z-50', 'top-2', 'right-0', 'translate-x-[100%]', 'w-fit');
      toastContainer.setAttribute("role", "alert");
      toastContainer.id = this.id;
  
      const template = `
        <div class="toast__wrapper ${this.color ? this.color : ''} w-full h-10 px-4 flex justify-center items-center font-bold">
          <div class="toast__message">
            <p>${this.message}</p>
          </div>
        </div>
      ` 
  
      toastContainer.innerHTML = template;
      this.show(toastContainer)
    }
  
    show(toast) {
      const body = document.querySelector("body");
      body.appendChild(toast);
  
      this.animate(toast)
  
      setTimeout(() => {
        this.destroy(toast);
      }, this.timmer)
    }
  
    destroy(toast) {
      setTimeout(() => {
        toast.remove()
        this.clearTimeouts()
      }, 100)
    }
  
    animate(toast) {
      gsap.to(toast, {
        x: 0,
        duration: 0.3
      })
  
      const timeout = setTimeout(() => {
      gsap.to(toast, {
          x: '100%',
          duration: 0.2,
          onComplete: () => {
            this.destroy(toast)
          }
        })
      }, 2000)
      
      this.timeouts.push(timeout)
    }
  
    clearTimeouts() {
      this.timeouts.forEach(timeout => clearTimeout(timeout))
    }
  }

  return {
    provide: {
      toast: Toast
    }
  }

})