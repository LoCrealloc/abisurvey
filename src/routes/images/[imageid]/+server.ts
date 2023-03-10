import { Picture } from "$lib/server/models/picture";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

interface WhereQuery {
	id: number;
	[userId: string]: number;
}

export const GET = (async ({ params, setHeaders, locals }) => {
	if (!params.imageid) {
		throw error(400, { message: "No image id provided!" });
	}

	const where_params: WhereQuery = { id: parseInt(params.imageid) };

	if (!locals.loggedInAdmin) {
		where_params["userId"] = locals.userId;
	}

	const img = await Picture.findOne({
		where: where_params,
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
