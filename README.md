This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Sakai is an application template for Next.js based on the popular Next.js framework with new App Router. 

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Structure

<p>Sakai consists of a couple folders, demos and core has been separated so that you can easily remove what is not necessary for your application.</p>
            <p>
                There are two
                <a href="https://nextjs.org/docs/app/building-your-application/routing/route-groups" className="font-medium hover:underline">
                    root groups
                </a>
                under the app folder;
                <span className="text-primary font-medium"> (main) </span>
                represents the pages that reside in the main dashboard layout whereas
                <span className="text-primary font-medium"> (full-page) </span> groups
                the pages with full page content such as landing page or a login page.
            </p>

## Integration with Existing Next.js Applications

Only the folders related to the layout need to be moved into your project. Integration of pages involves moving the files under those folders. Make sure that the using page is defined under the related group layout.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
