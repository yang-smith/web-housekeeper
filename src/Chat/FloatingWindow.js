import {submit, submitbase} from './ChatGPT.js'
import {marked} from 'marked';
import Screen from '../Experience/Screen.js'
import Experience from '../Experience/Experience.js'
export default class FloatingWindow {
    constructor(model, world) {

        const experience = Experience.instance;
        if (!experience || !experience.world) {
            throw new Error('Experience is not initialized or does not contain world');
        }
        this.experience = experience
        this.model = model;
        this.world = experience.world;
        this.createWindow();
        this.createCollapsibleWindow();

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
        // var inputstr = "智能设备状态" + this.getAllDeviceStatus();
        var inputstr = inputstr + "。 额外信息：" + this.inputbase.textContent;
        inputstr = inputstr + "。 主人说："+ this.input.value + "。请只输出json。";
        this.input.value = '';
        console.log(inputstr);
        console.log(this.getAllDeviceStatus());
        // 调用API并显示返回的内容
        // const answer = await submit(inputstr);
        const answer = await submitbase(inputstr);
        console.log(answer.message);
        if (answer) {
            this.showmessage(answer.message);
            this.updateProperty(answer.message);
        }
    }
    showmessage(content) {
        let jsonString = content; 
        let jsonData = JSON.parse(jsonString); 
        this.output.innerHTML = marked("回答："+jsonData["answer"]+"\n \n 行为：" + jsonData["action"]);
    }
    updateProperty(content) { 
        let jsonString = content; 
        let jsonData = JSON.parse(jsonString); 
        console.log(jsonData);
        this.changeProperty(jsonData, 'uNightMix');
        this.changeProperty(jsonData, 'uLightTvStrength');
        this.changeProperty(jsonData, 'uLightPcStrength');
        this.changeProperty(jsonData, 'uLightDeskStrength');
        this.changeColorProperty(jsonData, 'uLightTvColor')
        this.changeColorProperty(jsonData, 'uLightPcColor')
        this.changeColorProperty(jsonData, 'uLightDeskColor')
        this.changeScreenProperty(jsonData, 'pcScreen');
        this.changeScreenProperty(jsonData, 'macScreen');

    }
    changeProperty(content, propertyName) {
        if (propertyName in content) {
            let targetValue = parseFloat(content[propertyName]);
            // console.log(targetValue);
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
        if (propertyName in content) {
            let targetColor = content[propertyName];
            if (targetColor) {
                // 将十六进制颜色值转换为RGB值
                let r = parseInt(targetColor.slice(1, 3), 16) / 255;
                let g = parseInt(targetColor.slice(3, 5), 16) / 255;
                let b = parseInt(targetColor.slice(5, 7), 16) / 255;
                this.model.material.uniforms[propertyName].value = { r, g, b };
            }
        }
    }
    changeScreenProperty(content, propertyName) {
        if (propertyName in content) {
            let targetValue = parseFloat(content[propertyName]);
            // console.log(targetValue);
            if (targetValue == 0) {
                if(propertyName == 'pcScreen')
                    this.world.pcScreen.stopVideo();
                else if(propertyName == 'macScreen')
                    this.world.macScreen.stopVideo();
            }
            else if (targetValue == 1) {
                if(propertyName == 'pcScreen')
                    this.world.pcScreen.changeVideoSource('/assets/videoPortfolio.mp4');
                else if(propertyName == 'macScreen')
                    this.world.macScreen.changeVideoSource('/assets/videoStream.mp4');

            }
        }
    }

    createWindow() {
        this.window = document.createElement('div');
        this.window.style.position = 'fixed';
        this.window.style.bottom = '50px'; // 设置窗口在底部
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
        this.button.addEventListener('touchend', this.sendQuestion);

        // 将输入框和按钮添加到窗口中
        this.window.appendChild(this.input);
        this.window.appendChild(this.button);

        // 将窗口添加到文档中
        document.body.appendChild(this.window);
    }
    

    createCollapsibleWindow() {
        this.collapsible = document.createElement('div');
        this.collapsible.style.position = 'fixed';
        this.collapsible.style.top = '60px'; // 设置窗口在顶部
        this.collapsible.style.left = '30px'; // 设置窗口在左侧
        this.collapsible.style.zIndex = '1000'; // 确保窗口在其他元素之上
        // this.collapsible.style.padding = '100px';
        this.collapsible.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // 设置半透明的背景色
        this.collapsible.style.display = 'none'; // 初始时是折叠的
        this.collapsible.style.width = '200px'; 
        this.collapsible.style.height = '250px'; 

        // 创建一个展开/折叠按钮
        this.collapsibleButton = document.createElement('button');
        this.collapsibleButton.style.position = 'fixed';
        this.collapsibleButton.style.top = '30px'; 
        this.collapsibleButton.style.left = '10px'; 
        this.collapsibleButton.style.zIndex = '1000'; 
        this.collapsibleButton.textContent = '个人信息 ↓';
        this.collapsibleButton.addEventListener('click', () => {
            if (this.collapsible.style.display === 'none') {
                this.collapsible.style.display = 'block';
                this.collapsibleButton.textContent = '个人信息 ↑';
            } else {
                this.collapsible.style.display = 'none';
                this.collapsibleButton.textContent = '个人信息 ↓';
            }
        });
        this.collapsibleButton.addEventListener('touchend', () => {
            if (this.collapsible.style.display === 'none') {
                this.collapsible.style.display = 'block';
                this.collapsibleButton.textContent = '个人信息 ↑';
            } else {
                this.collapsible.style.display = 'none';
                this.collapsibleButton.textContent = '个人信息 ↓';
            }
        });
        // 创建一个多行输入框
        this.inputbase = document.createElement('textarea');
        this.inputbase.style.top = '70px';
        this.inputbase.style.width = '200px'; 
        this.inputbase.style.height = '250px'; 
        this.inputbase.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        this.inputbase.style.resize = 'none'; // 禁止调整大小
        this.inputbase.textContent = '我是一个城市白领，我工作日每天八点起床，晚上一般11点睡觉。我工作需要使用电脑。';

        // 将输入框添加到可折叠窗口中
        this.collapsible.appendChild(this.inputbase);

        // 将可折叠窗口和展开/折叠按钮添加到文档中
        document.body.appendChild(this.collapsible);
        document.body.appendChild(this.collapsibleButton);
    }

    getAllDeviceStatus() {
        let status = {
            "uNightMix": this.model.material.uniforms.uNightMix.value,
            "uLightTvStrength": this.model.material.uniforms.uLightTvStrength.value,
            "uLightPcStrength": this.model.material.uniforms.uLightPcStrength.value,
            "uLightDeskStrength": this.model.material.uniforms.uLightDeskStrength.value,
            "uLightTvColor": this.rgbToHex(this.model.material.uniforms.uLightTvColor.value),
            "uLightPcColor": this.rgbToHex(this.model.material.uniforms.uLightPcColor.value),
            "uLightDeskColor": this.rgbToHex(this.model.material.uniforms.uLightDeskColor.value),
            "pcScreen": this.world.pcScreen.isVideoPlaying() ? 1 : 0,
            "macScreen": this.world.macScreen.isVideoPlaying() ? 1 : 0
        };
    
        return JSON.stringify(status);
    }
    rgbToHex(color) {
        let rgb = (color.r * 255 << 16) + (color.g * 255 << 8) + color.b * 255;
        let hex = Number(rgb).toString(16);
        while (hex.length < 6) {
            hex = "0" + hex;
        }
        return '#' + hex;
    }
        
    
}
