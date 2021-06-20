import { GetServerSideProps } from "next";
import firebase from "firebase/app";
import "firebase/firestore";

const Slug = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { slug } = context.params;

  const firebaseConfig = {
    apiKey: "{ value }",
    authDomain: "{ value }",
    projectId: "{ value }",
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.firestore();

  let result: { slug: string; full_url: string } | undefined;

  const querySnapShot = await db
    .collection("urls")
    .where("slug", "==", slug)
    .get();

  querySnapShot.forEach(
    (doc) => (result = doc.data() as { slug: string; full_url: string })
  );

  return result == undefined
    ? {
        redirect: {
          destination: "/",
          permanent: true,
        },
      }
    : {
        redirect: {
          destination: result.full_url,
          permanent: true,
        },
      };
};

export default Slug;
