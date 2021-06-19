import { GetServerSideProps } from "next";
import firebase from "firebase/app";
import "firebase/firestore";

const Slug = () => {
  return null;
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  // get the domain.com/{slug} into slug variable
  const { slug } = context.params;

  // replace with values from Firebase project
  const firebaseConfig = {
    apiKey: "{ value }",
    authDomain: "{ value }",
    projectId: "{ value }",
  };

  // we are checking if firebase has been initialized before,
  // if yes, then we don't re-initialize
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.firestore();

  // query Firestore
  let result: { slug: string; full_url: string } | undefined;
  const querySnapShot = await db
    .collection("urls")
    .where("slug", "==", slug)
    .get();
  querySnapShot.forEach(
    (doc) => (result = doc.data() as { slug: string; full_url: string })
  );

  // return redirect url based on query result
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
