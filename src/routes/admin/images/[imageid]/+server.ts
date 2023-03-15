import { Picture } from "$lib/server/models/picture";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET = (async ({ params, setHeaders }) => {
	if (!params.imageid) {
		throw error(400, { message: "No image id provided!" });
	}

	const img = await Picture.findOne({
		where: { id: parseInt(params.imageid) },
		attributes: ["image", "mimetype", "updatedAt", "size"],
	});

	if (!img || !img.image) {
		throw error(404, "Image not found");
	}

	setHeaders({
		"Content-Type": img.mimetype,
		"Content-Length": img.size.toString(),
		"Last-Modified": new Date(img.updatedAt).toUTCString(),
		"Cache-Control": "private, no-cache",
	});

	return new Response(img.image);
}) satisfies RequestHandler;
