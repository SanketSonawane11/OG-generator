import { createCanvas, loadImage, registerFont } from 'canvas';
import supabase from '../../../utils/supabaseClient';
import path from 'path';

const fontPath = path.resolve('./public/fonts/Roboto-Regular.ttf');

try {
    registerFont(fontPath, { family: 'Roboto' });
} catch (error) {
    console.error('Font registration error:', error);
}

function createGradient(ctx, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#8338EC');
    gradient.addColorStop(1, '#7209B7');
    return gradient;
}

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

function drawText(ctx, title, content, maxHeight, maxLines = 2) {
    //title
    ctx.font = 'bold 60px Roboto';
    ctx.fillStyle = '#240046';
    ctx.fillText(title, 60, 100);

    //Author
    const authorName = 'Author Name';
    const profileCircleRadius = 25;
    const titleWidth = ctx.measureText(title).width;
    const separatorX = 60 + titleWidth + 20;

    const profileCircleX = separatorX + 20;
    const profileCircleY = 85;

    // Author circle
    ctx.beginPath();
    ctx.arc(profileCircleX + profileCircleRadius, profileCircleY, profileCircleRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#ddd'; //Cirlce border
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();

    // Separator
    ctx.font = 'bold 43px Roboto';
    ctx.fillStyle = '#333';
    ctx.fillText('|', separatorX, profileCircleY + 10);

    ctx.font = '30px Roboto';
    ctx.fillStyle = '#333';
    ctx.fillText(`${authorName}`, profileCircleX + profileCircleRadius * 2 + 15, profileCircleY + 10);

    // Content
    const maxWidth = 1150;
    const lineHeight = 40;
    let y = 190;

    ctx.font = '40px Roboto';
    ctx.fillStyle = '#3c096c';

    function wrapText(text, maxWidth) {
        const words = text.split(' ');
        let line = '';
        const lines = [];

        for (const word of words) {
            const testLine = line + word + ' ';
            const testWidth = ctx.measureText(testLine).width;

            if (testWidth > maxWidth && line) {
                lines.push(line.trim());
                line = word + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line.trim());

        return lines;
    }

    const lines = wrapText(content, maxWidth);
    let textHeight = 0;

    const visibleLinesCount = maxLines;

    if (lines.length > visibleLinesCount) {
        for (let i = 0; i < visibleLinesCount; i++) {
            ctx.fillText(lines[i], 60, y);
            y += lineHeight;
        }
        ctx.fillText('...', 60, y);
        textHeight = y - 190;
    } else {
        lines.forEach((line) => {
            ctx.fillText(line, 60, y);
            y += lineHeight;
        });
        textHeight = y - 190;
    }

    return textHeight;
}

async function processImage(ctx, imageFile, textHeight) {
    if (imageFile) {
        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        const image = await loadImage(imageBuffer);

        const canvasWidth = ctx.canvas.width;
        let imageWidth = image.width - 250;
        let imageHeight = image.height - 250;

        const padding = 20;
        const maxImageHeight = ctx.canvas.height - (textHeight + 140) - padding - padding;

        if (imageHeight > maxImageHeight) {
            const scale = maxImageHeight / imageHeight;
            imageHeight = maxImageHeight;
            imageWidth = imageWidth * scale;
        }
        const imageXPosition = (canvasWidth - imageWidth) / 2;
        const imageYPosition = ctx.canvas.height - imageHeight - padding;

        const borderRadius = 25;

        ctx.beginPath();
        ctx.moveTo(imageXPosition + borderRadius, imageYPosition);
        ctx.lineTo(imageXPosition + imageWidth - borderRadius, imageYPosition);
        ctx.quadraticCurveTo(imageXPosition + imageWidth, imageYPosition, imageXPosition + imageWidth, imageYPosition + borderRadius);
        ctx.lineTo(imageXPosition + imageWidth, imageYPosition + imageHeight - borderRadius);
        ctx.quadraticCurveTo(imageXPosition + imageWidth, imageYPosition + imageHeight, imageXPosition + imageWidth - borderRadius, imageYPosition + imageHeight);
        ctx.lineTo(imageXPosition + borderRadius, imageYPosition + imageHeight);
        ctx.quadraticCurveTo(imageXPosition, imageYPosition + imageHeight, imageXPosition, imageYPosition + imageHeight - borderRadius);
        ctx.lineTo(imageXPosition, imageYPosition + borderRadius);
        ctx.quadraticCurveTo(imageXPosition, imageYPosition, imageXPosition + borderRadius, imageYPosition);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(image, imageXPosition, imageYPosition, imageWidth, imageHeight);
    }
}

export async function POST(request) {
    try {
        const formData = await request.formData();
        const title = formData.get('title');
        const content = formData.get('content');
        const imageFile = formData.get('image');

        const canvas = createCanvas(1200, 630);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = createGradient(ctx, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#edf2fb';
        drawRoundedRect(ctx, 10, 10, 1180, 610, 20);

        const maxLines = imageFile ? 2 : 7;
        const textAreaHeight = drawText(ctx, title, content, 590, maxLines);
        const imagePadding = 20;
        const imageYPosition = textAreaHeight + imagePadding;

        await processImage(ctx, imageFile, imageYPosition);

        // if (imageFile) {
        //     const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        //     const image = await loadImage(imageBuffer);
        //     ctx.drawImage(image, 50, 300, 500, 500);
        // }

        const buffer = canvas.toBuffer('image/png');

        const { data, error } = await supabase
            .storage
            .from('OG')
            .upload(`generated/${Date.now()}.png`, buffer, {
                contentType: 'image/png'
            });

        if (error) throw new Error(error.message);

        const { data: urlData, error: urlError } = supabase
            .storage
            .from('OG')
            .getPublicUrl(data.path);

        if (urlError) throw new Error(urlError.message);

        return new Response(JSON.stringify({ imageUrl: urlData.publicUrl }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error generating image:', error);
        return new Response('Error generating image', { status: 500 });
    }
}
