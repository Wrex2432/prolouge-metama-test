import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
region: process.env.AWS_REGION,
credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
},
});

export async function POST(request) {
const formData = await request.formData();
const file = formData.get('file');

if (!file) {
    return Response.json({ error: "No file" }, { status: 400 });
}

const bytes = await file.arrayBuffer();
const buffer = Buffer.from(bytes);

const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${file.name}`,
    Body: buffer,
    ContentType: file.type,
};

await s3.send(new PutObjectCommand(params));

return Response.json({ success: true });
}
