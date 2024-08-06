import { createCanvas, loadImage, registerFont } from 'canvas';
import supabase from '../../../utils/supabaseClient';
import path from 'path';

const fontPath = path.resolve('./public/fonts/Roboto-Regular.ttf');
console.log('Font path:', fontPath);

try {
    registerFont(fontPath, { family: 'Roboto' });
    console.log('Font registered successfully');
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

        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = 'bold 60px Roboto';
        ctx.fillStyle = '#000';
        ctx.fillText(title, 50, 100);

        ctx.font = '40px Roboto';
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
