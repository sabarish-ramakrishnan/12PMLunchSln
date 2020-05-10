import { notify } from 'react-notify-toast';
const delay = 1000;
class toast {
    constructor() {
        // this.info = notify.createShowQueue();
        // this.error = notify.createShowQueue();
        // this.success = notify.createShowQueue();
    }
    info = (msg) => {
        const myColor = { background: '#FFFF00', text: "#000000" };
        notify.show(msg, "custom", 0, myColor);
    }
    error = (msg) => {
        const myColor = { background: '#FF0000', text: "#FFFFFF" };
        notify.show(msg, "custom", 0, myColor);
    }
    success = (msg) => {
        const myColor = { background: '#00FF00', text: "#000000" };
        notify.show(msg, "custom", 0, myColor);
    }
}
export default new toast();