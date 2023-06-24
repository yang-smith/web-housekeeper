import {submit} from './ChatGPT.js'
import {marked} from 'marked';

export default class FloatingWindow {
    constructor(model) {
        this.model = model;
        this.createWindow();

        // 创建显示返回内容的元素
        this.output = document.createElement('div');
        this.output.style.position = 'fixed';
        this.output.style.top = '0';
        this.output.style.left = '50%';
        this.output.style.transform = 'translateX(-50%)';
        this.output.style.padding = '10px';
        this.output.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        this.output.style.border = '1px solid black';
        this.output.style.borderRadius = '5px';
        this.output.style.zIndex = '1000';
        this.output.style.maxWidth = '80%';
        this.output.style.overflow = 'auto';
        this.output.style.cursor = 'move';
        document.body.appendChild(this.output);

        // 使元素可拖动
        this.output.addEventListener('mousedown', (event) => {
            const move = (event) => {
                this.output.style.left = `${event.clientX}px`;
                this.output.style.top = `${event.clientY}px`;
            };
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', move);
            }, { once: true });
        });
    }

    async sendQuestion() {
        const question = this.input.value;
        this.input.value = '';

        // 调用API并显示返回的内容
        const answer = await submit(question);
        console.log(answer);
        if (answer) {
            // this.output.textContent = answer.message;
            this.output.innerHTML = marked(answer.message);
            this.changeProperty(answer.message, 'uNightMix');
            this.changeProperty(answer.message, 'uLightTvStrength');
            this.changeProperty(answer.message, 'uLightPcStrength');
            this.changeProperty(answer.message, 'uLightDeskStrength');
            this.changeColorProperty(answer.message, 'uLightTvColor')
            this.changeColorProperty(answer.message, 'uLightPcColor')
            this.changeColorProperty(answer.message, 'uLightDeskColor')
            // console.log(this.model.material.uniforms.uLightTvStrength.value);
        }
    }

    changeProperty(content, propertyName) {
        var regex = new RegExp(propertyName + "：\\s*(\\d+(\\.\\d+)?)");
        var match = content.match(regex);
        if (match) {
            let targetValue = parseFloat(match[1]);
            console.log(targetValue);
            if (!isNaN(targetValue)) {
                let currentValue = this.model.material.uniforms[propertyName].value;
                let step = (targetValue - currentValue) / 100; // 分100步完成过渡
                let intervalId = setInterval(() => {
                    currentValue += step;
                    if ((step > 0 && currentValue >= targetValue) || (step < 0 && currentValue <= targetValue)) {
                        // 如果已经达到或超过目标值，就停止过渡
                        currentValue = targetValue;
                        clearInterval(intervalId);
                    }
                    this.model.material.uniforms[propertyName].value = currentValue;
                }, 10); // 每10毫秒更新一次值
            }
        }
    }
    changeColorProperty(content, propertyName) {
        var regex = new RegExp(propertyName + "：\\s*(#[0-9a-fA-F]{6})");
        var match = content.match(regex);
        if (match) {
            let targetColor = match[1];
            if (targetColor) {
                // 将十六进制颜色值转换为RGB值
                let r = parseInt(targetColor.slice(1, 3), 16) / 255;
                let g = parseInt(targetColor.slice(3, 5), 16) / 255;
                let b = parseInt(targetColor.slice(5, 7), 16) / 255;
    
                // 假设你的颜色属性是一个包含r, g, b属性的对象
                this.model.material.uniforms[propertyName].value = { r, g, b };
            }
        }
    }
    
    createWindow() {
        this.window = document.createElement('div');
        this.window.style.position = 'fixed';
        this.window.style.bottom = '30px'; // 设置窗口在底部
        this.window.style.left = '50%'; // 设置窗口在中间
        this.window.style.transform = 'translateX(-50%)'; // 确保窗口在中间
        this.window.style.zIndex = '1000'; // 确保窗口在其他元素之上
        // this.window.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // 设置半透明的背景色
        this.window.style.padding = '10px';
        this.window.style.display = 'flex'; // 使用flex布局使得输入框和按钮在同一行

        // 创建一个输入框
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.style.width = '400px'; 
        this.input.style.height = '30px'; 
        this.input.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        this.input.addEventListener('change', (event) => {
            // this.model.material.uniforms.uNightMix.value = parseFloat(event.target.value);
            this.sendQuestion();
        });

        // 创建一个发送按钮
        this.button = document.createElement('button');
        this.button.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        this.button.textContent = '发送';
        this.button.addEventListener('click', () => {
            // this.model.material.uniforms.uNightMix.value = parseFloat(this.input.value);
            this.sendQuestion();
        });

        // 将输入框和按钮添加到窗口中
        this.window.appendChild(this.input);
        this.window.appendChild(this.button);

        // 将窗口添加到文档中
        document.body.appendChild(this.window);
    }
}
