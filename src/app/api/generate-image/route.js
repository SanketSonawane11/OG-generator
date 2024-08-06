// import { createCanvas, loadImage, registerFont } from 'canvas';
// import supabase from '../../../utils/supabaseClient';
// import path from 'path';

// const fontPath = path.resolve('./public/fonts/Roboto-Regular.ttf');

// try {
//     registerFont(fontPath, { family: 'Roboto' });
// } catch (error) {
//     console.error('Font registration error:', error);
// }

// export async function POST(request) {
//     try {
//         const formData = await request.formData();
//         const title = formData.get('title');
//         const content = formData.get('content');
//         const imageFile = formData.get('image');

//         const canvas = createCanvas(1200, 630);
//         const ctx = canvas.getContext('2d');
//         const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
//         gradient.addColorStop(0, '#8338EC');
//         gradient.addColorStop(1, '#3A86FF');

//         function drawRoundedRect(ctx, x, y, width, height, radius) {
//             ctx.beginPath();
//             ctx.moveTo(x + radius, y);
//             ctx.lineTo(x + width - radius, y);
//             ctx.arc(x + width - radius, y + radius, radius, 1.5 * Math.PI, 2 * Math.PI);
//             ctx.lineTo(x + width, y + height - radius);
//             ctx.arc(x + width - radius, y + height - radius, radius, 0, 0.5 * Math.PI);
//             ctx.lineTo(x + radius, y + height);
//             ctx.arc(x + radius, y + height - radius, radius, 0.5 * Math.PI, Math.PI);
//             ctx.lineTo(x, y + radius);
//             ctx.arc(x + radius, y + radius, radius, Math.PI, 1.5 * Math.PI);
//             ctx.closePath();
//             ctx.fill();
//         }

//         ctx.fillStyle = '#edf2fb';
//         drawRoundedRect(ctx, 50, 50, 400, 300, 20);
//         ctx.fillRect(0, 0, canvas.width, canvas.height);

//         ctx.strokeStyle = gradient;
//         ctx.lineWidth = 8;
//         ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);

//         ctx.font = 'bold 60px Roboto';
//         ctx.fillStyle = '#000';
//         ctx.fillText(title, 50, 100);

//         ctx.font = '40px Roboto';
//         ctx.fillStyle = '#1A1A1A';
//         ctx.fillText(content.substring(0, 150) + '...', 50, 200);

//         if (imageFile) {
//             const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
//             const image = await loadImage(imageBuffer);
//             ctx.drawImage(image, 50, 300, 500, 500);
//         }

//         const buffer = canvas.toBuffer('image/png');

//         const { data, error } = await supabase
//             .storage
//             .from('OG')
//             .upload(`generated/${Date.now()}.png`, buffer, {
//                 contentType: 'image/png'
//             });

//         if (error) {
//             throw new Error(error.message);
//         }

//         const { data: urlData, error: urlError } = supabase
//             .storage
//             .from('OG')
//             .getPublicUrl(data.path);

//         if (urlError) {
//             throw new Error(urlError.message);
//         }

//         return new Response(JSON.stringify({ imageUrl: urlData.publicUrl }), {
//             headers: { 'Content-Type': 'application/json' },
//         });
//     } catch (error) {
//         console.error('Error generating image:', error);
//         return new Response('Error generating image', { status: 500 });
//     }
// }


import { createCanvas, loadImage, registerFont } from 'canvas';
import supabase from '../../../utils/supabaseClient';
import path from 'path';

const fontPath = path.resolve('./public/fonts/Roboto-Regular.ttf');

try {
    registerFont(fontPath, { family: 'Roboto' });
} catch (error) {
    console.error('Font registration error:', error);
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const title = formData.get('title');
        const content = formData.get('content');
        const imageFile = formData.get('image');

        const canvas = createCanvas(1200, 630);
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#8338EC');
        gradient.addColorStop(1, '#7209B7');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        function drawRoundedRect(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.arc(x + width - radius, y + radius, radius, 1.5 * Math.PI, 2 * Math.PI);
            ctx.lineTo(x + width, y + height - radius);
            ctx.arc(x + width - radius, y + height - radius, radius, 0, 0.5 * Math.PI);
            ctx.lineTo(x + radius, y + height);
            ctx.arc(x + radius, y + height - radius, radius, 0.5 * Math.PI, Math.PI);
            ctx.lineTo(x, y + radius);
            ctx.arc(x + radius, y + radius, radius, Math.PI, 1.5 * Math.PI);
            ctx.closePath();
            ctx.fill();
        }

        ctx.fillStyle = '#edf2fb';
        drawRoundedRect(ctx, 10, 10, 1180, 610, 20);

        ctx.font = 'bold 60px Roboto';
        ctx.fillStyle = '#240046';
        ctx.fillText(title, 50, 100);

        ctx.font = '40px Roboto';
        ctx.fillStyle = '#3c096c';
        ctx.fillText(content.substring(0, 150) + '...', 50, 200);

        if (imageFile) {
            const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
            const image = await loadImage(imageBuffer);
            ctx.drawImage(image, 50, 300, 500, 500);
        }

        const buffer = canvas.toBuffer('image/png');

        const { data, error } = await supabase
            .storage
            .from('OG')
            .upload(`generated/${Date.now()}.png`, buffer, {
                contentType: 'image/png'
            });

        if (error) {
            throw new Error(error.message);
        }

        const { data: urlData, error: urlError } = supabase
            .storage
            .from('OG')
            .getPublicUrl(data.path);

        if (urlError) {
            throw new Error(urlError.message);
        }

        return new Response(JSON.stringify({ imageUrl: urlData.publicUrl }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error generating image:', error);
        return new Response('Error generating image', { status: 500 });
    }
}
