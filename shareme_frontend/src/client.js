import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";


export const client = sanityClient({
  projectId: '8ufzjng5',
  dataset: "production",
  apiVersion: "2000-08-12",
  useCdn: true,
  token: 'skHbukejeww306BuuKGUjAgRoDANtSIDjehBI91KqPxvFHnggEOo80n6KNPuoLuK9METGLYswDMDE5ssxGoIGGt6Oj2at3eXTrVqKTDL9171CnuKyiXwMsEt19CmcMiN5VG7AvYEepeyY5284RqZfNve5HZrDFLyqNT5ADMQeNoc90cHxuf7',
});

const builder = imageUrlBuilder(client);
export const urlFor =(source)=> builder.image(source);
