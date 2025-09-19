import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey:
    process.env.IMAGEKIT_PUBLIC_KEY || "public_jEy83ckli3iaxhZ2v3C9wKSH9ys=",
  privateKey:
    (process.env.IMAGEKIT_PRIVATE_KEY as string) ||
    "private_TvXumW89vEENTpca6UXfiesNp14=",
  urlEndpoint:
    (process.env.IMAGEKIT_URL_ENDPOINT as string) ||
    "https://ik.imagekit.io/kit1692fz/",
});

export default imagekit;
