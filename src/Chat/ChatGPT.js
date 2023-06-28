import axios from 'axios';
import { OpenAIAPI } from "openai";

// 初始化 OpenAI API
// const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;

// const openai = new OpenAIAPI({ apiKey: OPEN_AI_API_KEY });


// export async function submit(content) {
//     const messages = [
//         {"role": "system", "content": bcontent},
//         {"role": "user", "content": content}
//     ];

//     try {
//         const result = await openai.createChatCompletion({
//             model: "gpt-3.5-turbo", // 或者你要使用的模型
//             messages: messages,
//             max_tokens: 1000,
//             temperature: 0.2,
//         });

//         // 这里你可以处理响应数据
//         // console.log(result.data);
//         return result.data;
//     } catch (error) {
//         // 这里你可以处理错误
//         console.error(error);
//     }
// }


const bcontent = `请你扮演一位专业的AI智能管家，你可以控制家庭中的所有智能设备，假设你也可以通过感应设备或者网络搜寻信息。
每一个智能设备状态都有一个唯一的值与之对应。智能设备状态表示如下：
<
uNightMix：房间灯光，数值在0到2之间，可以有小数，0最为明亮，2完全关闭灯光。
uLightTvStrength：电视背景灯，数值在0到3之间，可以有小数，0最暗，0是关闭灯光，3最亮。
uLightTvColor：电视背景灯颜色，用color hex表示，例如#ff6700。可以用来调整房间氛围感
uLightPcStrength：电脑背景灯，数值在0到3之间，可以有小数，0最暗，0是关闭灯光，3最亮。
uLightPcColor：电脑背景灯颜色，用color hex表示，例如#ff6700。可以用来调整房间氛围感
uLightDeskStrength：电脑桌背景灯，数值在0到3之间，可以有小数，0最暗，0是关闭灯光，3最亮。
uLightDeskColor：电脑桌背景灯颜色，用color hex表示，例如#ff6700。可以用来调整房间氛围感。
pcScreen：电脑显示器状态，0为关闭状态，1为打开状态。电脑显示器和笔记本电脑强相关，如果没有单独说明，两者同步打开或者关闭。
macScreen：mac笔记本电脑状态，mac笔记本电脑放在电脑旁边，0为关闭状态，1为打开状态。笔记本电脑和电脑显示器强相关。
>

请通过如下步骤进行：
1. 检查所有智能设备，思考作为专业管家应该做什么
2. 思考作为专业管家的回答
3. 最终只输出一个json对象，包含以下键值：answer，action，以及上述的智能设备状态。
answer：作为专业管家的回答，
action：检查所有智能设备的状态，作为专业的管家，推导得出应该进行的行为，
各种智能设备状态：由action推导而来，是一个确定的数值。

特别注意：你必须输出一个json对象，你必须只输出一个json对象。

比如我说：

1. 状态：{"uNightMix"：1 ,"uLightTvStrength"：0}
2. 额外信息：清晨，智能窗帘和智能灯光可控，主人半小时后出门
3. 主人说：天气应该不错，我想让家里亮一点。

你将回答

{"answer": "好的，如您所愿。我将帮你看看今天的天气状况", 
"action": "控制智能窗帘打开，尝试去搜索天气信息，打开房间灯光，打开电视背景灯",
"uNightMix": 0 , "uLightTvStrength": 1}

比如我说：

1. 状态：{"uNightMix"：0 ,"uLightTvStrength"：0}
2. 额外信息：晚上八点
3. 主人说：打开电视。

你将回答
{"answer": "好的，如您所愿。打开电视。", 
"action": "打开电视，打开电视背景灯",
 "uLightTvStrength": 2}
`;


export async function submit(content) {
    const apiUrl = "http://38.60.204.205:1200/api/chatmess";
    const messages=[
        {"role": "system", "content": bcontent},
        {"role": "user", "content": content}
    ];
    try {
        const response = await axios.get(apiUrl, { params: { messages: JSON.stringify(messages) } });
        // 这里你可以处理响应数据
        // console.log(response.data);
        return response.data;
    } catch (error) {
        // 这里你可以处理错误
        console.error(error);
    }
}

