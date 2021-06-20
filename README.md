Repository for url-shortner-app post. Read the post on:

- [My Blog](https://okkarm.in/blog/your-own-url-shortner)
- [Dev.to](https://dev.to/okkarmin/your-own-bit-ly-for-a-grand-total-of-0-5hmi)

or...

## Sob story

I have always wanted to have my very own url shortner becuase of the following reasons:

1. Link will be easy to remember, for ownself and for others
2. Just plain cool. Imagine this, `https://{your-name}.ml/{whatever-you-want}`

`.ml` becuase it is free! `.tk` is also free. If you have some spare cash lying around, you can buy your own
`.com` or `.whaterver` domain you like

Okay sob story is done, let's get right down to it and here is [final repository](https://github.com/OkkarMin/url-shortner-app)

{% github OkkarMin/url-shortner-app no-readme%}

## Tech Stack

- NextJS + ChakraUI
- Firebase Firestore for data storage
- Vercel for hosting

## The Process

1. 'Purchase' domain
2. Set up Firebase
3. Create NextJS app
4. Host app on vercel
5. Add domain to vercel

## 1. 'Purchase' domain

We are going to obtain free domain from [freenom](https://freenom.com). Head over there, register for an account and
type in your desired domain in the `Find a new FREE domain`. Really anything you like but best is to keep it short.
I wanted `okkar.ml` but it was taken, so I got myself `okkar.tk` instead.

![Explaining how to get freenom free domain](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7tx1tei76d1v08l0j1br.png)


Choose 12 months when asked to select the duration, you can also 'release' the domain free domain back if you happen to
buy yourself a domain. Okay we are done with this step

## 2. Set up Firebase

You can use any database you are comfortable with. The shape of the data is simple.

```json
{
  "slug": "linkedin",
  "full_url": "http://linkedin.com/in/okarmin/"
}
```

When user, navigate to `https://okkar.tk/linkedin` they are going to get redirected to the full url, which is
`http://linkedin.com/in/okarmin/`. In general, when user visit `https://okkar.tk/[slug]` we are going to look up for
corresponding `full_url` and redirect the user to it.

- Go to Firebase console
- Add project, any name you like, I will be using `url-shortner-app`
- Default for rest of the options

Now it should take about a minute to create the project. Once ready, click on:

- `Continue`
- `Firestore Database` on the left
- `Create database`
- `Start in test mode`, [this article](https://medium.com/@gaute.meek/firestore-and-security-1d77812715c1) will do a better job than me to discuss about securing Firestore
- Choose location that is nearest to your country, `asia-southeast2` for Singapore. [See all Cloud Firestore locations here](https://firebase.google.com/docs/firestore/locations)

We have created Firestore, let's now add a document to it, click on:

- `Start collection`
- `urls` for Collection ID
- `Auto ID` for Document ID
- `slug`, `string` `github` then `Add field`
- `full_url`, `string`, `{your github link}` then `Save`

![Firebase Cloud Firestore state after adding one url](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9x1zhj8ql918dhthoz5y.png)

Add more document if you want to have more urls and remember to use same datashape of `{slug, full_url}`

We now need to add new web project and get configuration values from Firebase

- Click on setting icon beside `Project Over`
- `Add app`
- Choose web, `</>` logo
- Give it any nickname you like, I will be using `url-shortner-app`
- `Register`
- Firebase should now give you the configurations like below

```javascript
var firebaseConfig = {
  apiKey: "{ value }",
  authDomain: "{ value }",
  projectId: "{ value }",
  storageBucket: "{ value }",
  messagingSenderId: "{ value }",
  appId: "{ value }",
  measurementId: "{ value }",
};
```

Keep this tab open, we will be using the config in the next step.

## 3. Create NextJS app

We will use [with-chakra-ui-typescript](https://github.com/vercel/next.js/tree/canary/examples/with-chakra-ui-typescript) starter from NextJS.
Also npm install Firebase module to allow us to connect with Firestore.

```bash
npx create-next-app --example with-chakra-ui-typescript url-shortner-app
cd url-shortner-app
npm install firebase
```

You can delete the `src/components` and `pages/index.tsx` we will not be using them.

### 3.1 Page for redirecting to `full_url`

Create `pages/[slug].tsx` and put the following code

```typescript
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
    authDomain: "{ value }"
    projectId: "{ value }"
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
```

- We import the required modules and files
- Notice the `return null`, we don't have to return any UI component as we are will be redirecting the users
- On page visit, `getServerSideProps` will help us determine whether there is an entry in Firestore that has
  `{slug, full_url}` pair or not, if there is, redirect user to `full_url`, otherwise redirect user to `/` where 404 error
  page will be shown
- We are only making use of 3 config options for Firebase, `apiKey, authDomain, projectID` out of
  full configuration options that we obatined from step 2.

At this stage, you can `npm run dev` to test your app locally but for us we are sure that it will work :) so we don't test
and let us directly host on vercel and your folder structure should look like this

```ascii
url-shortner-app/
┣━━📁 src
┃ ┣━━📁 pages
┃ ┃ ┣━━ [slug].tsx
┃ ┃ ┣━━ _app.tsx
┃ ┃ ┗━━ _document.tsx
┃ ┗━━ theme.tsx
┣━━ .gitignore
┣━━ README.md
┣━━ next-env.d.ts
┣━━ package-lock.json
┣━━ package.json
┗━━ tsconfig.json
```

### 4. Host app on vercel

Vercel made it extremely easy to host NextJS apps. After all, Vercel is behind NextJS. Before we can host on vercel, create new
repository on github and push your codes to github.

Now we can:

- Login to Vercel using GitHub
- `New Project`
- `Import` the repository that you just created and pushed
- Use default options and `Deploy`

After it has successfully deployed, we need to link the domain we obtained from freenom with Vercel. Click on:

- `Domains`, in `https://vercel.com/dashboard`
- `Add`
- Select the project that was just deployed and `Continue`
- Type in your domain, `okkar.tk` for me and `Add`

You should see this and take note of `Type` and `Value` shown:

![Showing the state after you have added domain to Vercel](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pnv35g4ndf7k56ug5i66.png)

We now need to go back to freenom:

- `Services` -> `My Domains` -> `Manage Domain`
- `Manage Freenom DNS`
- Put the `Type` and `Value` you saw from Vercel here
- `Save Changes`

![Showing how A record look like on Freenom DNS](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/56jw2vtjv1zu6z7r8nvb.png)

Give it sometime for the DNS configuration to propagate and after some time you should be able to see `Valid Configuration`
on Vercel. Vercel magically gave us SSL certificate as well which allows our domain to have `https` protocol.

That's it! We now have a functioning app that allows you to pass your `slug` and redirect to `full_url`, in my case since
I bought domain, `https://okkarm.in/linkedin` will be redirected to `http://linkedin.com/in/okarmin/`.

## End

Right now we are adding new urls from Firebase console, you could try to extend what we have by adding an authenticated
page that allows you to add new urls from the app itself `https://domain.ml/addNewUrl`. Since we use `with-chakra-ui-typescript` starter,
you can now use UI components to quickly build fairly nice looking pages.

You could also add in Firebase analytics to keep track of how many visitors per shortened url. Tons of ways you can add on top
of this project.

With that, we end here for today, for more content like this, please hit the subscribe button and ofcourse smash that notificaiton
bell.
