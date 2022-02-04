import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import BlockViewer from '../BlockViewer';

const BlocksDemo = () => {
    const [checked, setChecked] = useState(false);

    const block1 = `
<div className="grid grid-nogutter surface-section text-800">
    <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
        <section>
            <span className="block text-6xl font-bold mb-1">Create the screens your</span>
            <div className="text-6xl text-primary font-bold mb-3">your visitors deserve to see</div>
            <p className="mt-0 mb-4 text-700 line-height-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

            <Button label="Learn More" type="button" className="mr-3 p-button-raised"></Button>
            <Button label="Live Demo" type="button" className="p-button-outlined"></Button>
        </section>
    </div>
    <div className="col-12 md:col-6 overflow-hidden">
        <img src="images/blocks/hero/hero-1.png" alt="hero-1" className="md:ml-auto block md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
    </div>
</div>
    `;

    const block2 = `
<div className="surface-section px-4 py-8 md:px-6 lg:px-8 text-center">
    <div className="mb-3 font-bold text-2xl">
        <span className="text-900">One Product, </span>
        <span className="text-blue-600">Many Solutions</span>
    </div>
    <div className="text-700 text-sm mb-6">Ac turpis egestas maecenas pharetra convallis posuere morbi leo urna.</div>
    <div className="grid">
        <div className="col-12 md:col-4 mb-4 px-5">
            <span className="p-3 shadow-2 mb-3 inline-block surface-card" style={{ borderRadius: '10px' }}>
                <i className="pi pi-desktop text-4xl text-blue-500"></i>
            </span>
            <div className="text-900 mb-3 font-medium">Built for Developers</div>
            <span className="text-700 text-sm line-height-3">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span>
        </div>
        <div className="col-12 md:col-4 mb-4 px-5">
            <span className="p-3 shadow-2 mb-3 inline-block surface-card" style={{ borderRadius: '10px' }}>
                <i className="pi pi-lock text-4xl text-blue-500"></i>
            </span>
            <div className="text-900 mb-3 font-medium">End-to-End Encryption</div>
            <span className="text-700 text-sm line-height-3">Risus nec feugiat in fermentum posuere urna nec. Posuere sollicitudin aliquam ultrices sagittis.</span>
        </div>
        <div className="col-12 md:col-4 mb-4 px-5">
            <span className="p-3 shadow-2 mb-3 inline-block surface-card" style={{ borderRadius: '10px' }}>
                <i className="pi pi-check-circle text-4xl text-blue-500"></i>
            </span>
            <div className="text-900 mb-3 font-medium">Easy to Use</div>
            <span className="text-700 text-sm line-height-3">Ornare suspendisse sed nisi lacus sed viverra tellus. Neque volutpat ac tincidunt vitae semper.</span>
        </div>
        <div className="col-12 md:col-4 mb-4 px-5">
            <span className="p-3 shadow-2 mb-3 inline-block surface-card" style={{ borderRadius: '10px' }}>
                <i className="pi pi-globe text-4xl text-blue-500"></i>
            </span>
            <div className="text-900 mb-3 font-medium">Fast & Global Support</div>
            <span className="text-700 text-sm line-height-3">Fermentum et sollicitudin ac orci phasellus egestas tellus rutrum tellus.</span>
        </div>
        <div className="col-12 md:col-4 mb-4 px-5">
            <span className="p-3 shadow-2 mb-3 inline-block surface-card" style={{ borderRadius: '10px' }}>
                <i className="pi pi-github text-4xl text-blue-500"></i>
            </span>
            <div className="text-900 mb-3 font-medium">Open Source</div>
            <span className="text-700 text-sm line-height-3">Nec tincidunt praesent semper feugiat. Sed adipiscing diam donec adipiscing tristique risus nec feugiat. </span>
        </div>
        <div className="col-12 md:col-4 md:mb-4 mb-0 px-3">
            <span className="p-3 shadow-2 mb-3 inline-block surface-card" style={{ borderRadius: '10px' }}>
                <i className="pi pi-shield text-4xl text-blue-500"></i>
            </span>
            <div className="text-900 mb-3 font-medium">Trusted Securitty</div>
            <span className="text-700 text-sm line-height-3">Mattis rhoncus urna neque viverra justo nec ultrices. Id cursus metus aliquam eleifend.</span>
        </div>
    </div>
</div>
    `;

    const block3 = `
<div className="surface-ground px-4 py-8 md:px-6 lg:px-8">
    <div className="text-900 font-bold text-6xl mb-4 text-center">Pricing Plans</div>
    <div className="text-700 text-xl mb-6 text-center line-height-3">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.</div>

    <div className="grid">
        <div className="col-12 lg:col-4">
            <div className="p-3 h-full">
                <div className="shadow-2 p-3 h-full flex flex-column surface-card" style={{ borderRadius: '6px' }}>
                    <div className="text-900 font-medium text-xl mb-2">Basic</div>
                    <div className="text-600">Plan description</div>
                    <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                    <div className="flex align-items-center">
                        <span className="font-bold text-2xl text-900">$9</span>
                        <span className="ml-2 font-medium text-600">per month</span>
                    </div>
                    <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                    <ul className="list-none p-0 m-0 flex-grow-1">
                        <li className="flex align-items-center mb-3">
                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Arcu vitae elementum</span>
                        </li>
                        <li className="flex align-items-center mb-3">
                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Dui faucibus in ornare</span>
                        </li>
                        <li className="flex align-items-center mb-3">
                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Morbi tincidunt augue</span>
                        </li>
                    </ul>
                    <hr className="mb-3 mx-0 border-top-1 border-none surface-border mt-auto" />
                    <Button label="Buy Now" className="p-3 w-full mt-auto"></Button>
                </div>
            </div>
        </div>

        <div className="col-12 lg:col-4">
            <div className="p-3 h-full">
                <div className="shadow-2 p-3 h-full flex flex-column surface-card" style={{ borderRadius: '6px' }}>
                    <div className="text-900 font-medium text-xl mb-2">Premium</div>
                    <div className="text-600">Plan description</div>
                    <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                    <div className="flex align-items-center">
                        <span className="font-bold text-2xl text-900">$29</span>
                        <span className="ml-2 font-medium text-600">per month</span>
                    </div>
                    <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                    <ul className="list-none p-0 m-0 flex-grow-1">
                        <li className="flex align-items-center mb-3">
                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Arcu vitae elementum</span>
                        </li>
                        <li className="flex align-items-center mb-3">
                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Dui faucibus in ornare</span>
                        </li>
                        <li className="flex align-items-center mb-3">
                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Morbi tincidunt augue</span>
                        </li>
                        <li className="flex align-items-center mb-3">
                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Duis ultricies lacus sed</span>
                        </li>
                    </ul>
                    <hr className="mb-3 mx-0 border-top-1 border-none surface-border" />
                    <Button label="Buy Now" className="p-3 w-full"></Button>
                </div>
            </div>
        </div>

        <div className="col-12 lg:col-4">
            <div className="p-3 h-full">
                <div className="shadow-2 p-3 flex flex-column surface-card" style={{ borderRadius: '6px' }}>
                    <div className="text-900 font-medium text-xl mb-2">Enterprise</div>
                    <div className="text-600">Plan description</div>
                    <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                    <div className="flex align-items-center">
                        <span className="font-bold text-2xl text-900">$49</span>
                        <span className="ml-2 font-medium text-600">per month</span>
                    </div>
                    <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                    <ul className="list-none p-0 m-0 flex-grow-1">
                        <li className="flex align-items-center mb-3">
                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Arcu vitae elementum</span>
                        </li>
                        <li className="flex align-items-center mb-3">
                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Dui faucibus in ornare</span>
                        </li>
                        <li className="flex align-items-center mb-3">
                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Morbi tincidunt augue</span>
                        </li>
                        <li className="flex align-items-center mb-3">
                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Duis ultricies lacus sed</span>
                        </li>
                        <li className="flex align-items-center mb-3">
                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Imperdiet proin</span>
                        </li>
                        <li className="flex align-items-center mb-3">
                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                            <span>Nisi scelerisque</span>
                        </li>
                    </ul>
                    <hr className="mb-3 mx-0 border-top-1 border-none surface-border" />
                    <Button label="Buy Now" className="p-3 w-full p-button-outlined"></Button>
                </div>
            </div>
        </div>
    </div>
</div>
    `;

    const block4 = `
<div className="surface-section px-4 py-8 md:px-6 lg:px-8">
    <div className="text-700 text-center">
        <div className="text-blue-600 font-bold mb-3"><i className="pi pi-discord"></i>&nbsp;POWERED BY DISCORD</div>
        <div className="text-900 font-bold text-5xl mb-3">Join Our Design Community</div>
        <div className="text-700 text-2xl mb-5">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.</div>
        <Button label="Join Now" icon="pi pi-discord" className="font-bold px-5 py-3 p-button-raised p-button-rounded white-space-nowrap"></Button>
    </div>
</div>
    `;

    const block5 = `
<div className="bg-bluegray-900 text-gray-100 p-3 flex justify-content-between lg:justify-content-center align-items-center flex-wrap">
    <div className="font-bold mr-8"><span role="img" aria-label="fire">🔥</span> Hot Deals!</div>
    <div className="align-items-center hidden lg:flex">
        <span className="line-height-3">Libero voluptatum atque exercitationem praesentium provident odit.</span>
    </div>
    <a className="flex align-items-center ml-2 mr-8">
        <span className="underline font-bold">Learn More</span>
    </a>
    <a className="p-ripple flex align-items-center no-underline justify-content-center border-circle text-gray-50 hover:bg-bluegray-700 cursor-pointer transition-colors transition-duration-150 p-ripple" style={{ width: '2rem', height: '2rem' }}>
        <i className="pi pi-times"></i>
    </a>
</div>
    `;

    const block6 = `
<div className="surface-section px-4 py-5 md:px-6 lg:px-8">
    <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
        <li>
            <a className="text-500 no-underline line-height-3 cursor-pointer">Application</a>
        </li>
        <li className="px-2">
            <i className="pi pi-angle-right text-500 line-height-3"></i>
        </li>
        <li>
            <span className="text-900 line-height-3">Analytics</span>
        </li>
    </ul>
    <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
        <div>
            <div className="font-medium text-3xl text-900">Customers</div>
            <div className="flex align-items-center text-700 flex-wrap">
                <div className="mr-5 flex align-items-center mt-3">
                    <i className="pi pi-users mr-2"></i>
                    <span>332 Active Users</span>
                </div>
                <div className="mr-5 flex align-items-center mt-3">
                    <i className="pi pi-globe mr-2"></i>
                    <span>9402 Sessions</span>
                </div>
                <div className="flex align-items-center mt-3">
                    <i className="pi pi-clock mr-2"></i>
                    <span>2.32m Avg. Duration</span>
                </div>
            </div>
        </div>
        <div className="mt-3 lg:mt-0">
            <Button label="Add" className="p-button-outlined mr-2" icon="pi pi-user-plus" />
            <Button label="Save" icon="pi pi-check" />
        </div>
    </div>
</div>
    `;

    const block7 = `
<div className="surface-ground px-4 py-5 md:px-6 lg:px-8">
    <div className="grid">
        <div className="col-12 md:col-6 lg:col-3">
            <div className="surface-card shadow-2 p-3 border-round">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">Orders</span>
                        <div className="text-900 font-medium text-xl">152</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-shopping-cart text-blue-500 text-xl"></i>
                    </div>
                </div>
                <span className="text-green-500 font-medium">24 new </span>
                <span className="text-500">since last visit</span>
            </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
            <div className="surface-card shadow-2 p-3 border-round">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">Revenue</span>
                        <div className="text-900 font-medium text-xl">$2.100</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-map-marker text-orange-500 text-xl"></i>
                    </div>
                </div>
                <span className="text-green-500 font-medium">%52+ </span>
                <span className="text-500">since last week</span>
            </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
            <div className="surface-card shadow-2 p-3 border-round">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">Customers</span>
                        <div className="text-900 font-medium text-xl">28441</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-inbox text-cyan-500 text-xl"></i>
                    </div>
                </div>
                <span className="text-green-500 font-medium">520  </span>
                <span className="text-500">newly registered</span>
            </div>
        </div>
        <div className="col-12 md:col-6 lg:col-3">
            <div className="surface-card shadow-2 p-3 border-round">
                <div className="flex justify-content-between mb-3">
                    <div>
                        <span className="block text-500 font-medium mb-3">Comments</span>
                        <div className="text-900 font-medium text-xl">152 Unread</div>
                    </div>
                    <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-comment text-purple-500 text-xl"></i>
                    </div>
                </div>
                <span className="text-green-500 font-medium">85 </span>
                <span className="text-500">responded</span>
            </div>
        </div>
    </div>
</div>
    `;

    const block8 = `
<div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
    <div className="text-center mb-5">
        <img src="images/blocks/logos/hyper.svg" alt="hyper" height="50" className="mb-3" />
        <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
        <span className="text-600 font-medium line-height-3">Don't have an account?</span>
        <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a>
    </div>

    <div>
        <label htmlFor="email1" className="block text-900 font-medium mb-2">Email</label>
        <InputText id="email1" type="text" className="w-full mb-3" />

        <label htmlFor="password1" className="block text-900 font-medium mb-2">Password</label>
        <InputText id="password1" type="password" className="w-full mb-3" />

        <div className="flex align-items-center justify-content-between mb-6">
            <div className="flex align-items-center">
                <Checkbox inputId="rememberme1" binary className="mr-2" onChange={e => setChecked(e.checked)} checked={checked} />
                <label htmlFor="rememberme1">Remember me</label>
            </div>
            <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot password?</a>
        </div>

        <Button label="Sign In" icon="pi pi-user" className="w-full" />
    </div>
</div>
    `;

    const block9 = `
<div className="surface-section">
    <div className="font-medium text-3xl text-900 mb-3">Movie Information</div>
    <div className="text-500 mb-5">Morbi tristique blandit turpis. In viverra ligula id nulla hendrerit rutrum.</div>
    <ul className="list-none p-0 m-0">
        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Title</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">Heat</div>
            <div className="w-6 md:w-2 flex justify-content-end">
                <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
            </div>
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Genre</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                <Chip label="Crime" className="mr-2"></Chip>
                <Chip label="Drama" className="mr-2"></Chip>
                <Chip label="Thriller"></Chip>
            </div>
            <div className="w-6 md:w-2 flex justify-content-end">
                <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
            </div>
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Director</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">Michael Mann</div>
            <div className="w-6 md:w-2 flex justify-content-end">
                <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
            </div>
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Actors</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">Robert De Niro, Al Pacino</div>
            <div className="w-6 md:w-2 flex justify-content-end">
                <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
            </div>
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap">
            <div className="text-500 w-6 md:w-2 font-medium">Plot</div>
            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                A group of professional bank robbers start to feel the heat from police
                when they unknowingly leave a clue at their latest heist.</div>
            <div className="w-6 md:w-2 flex justify-content-end">
                <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
            </div>
        </li>
    </ul>
</div>
    `;

    const block10 = `
<div className="surface-card p-4 shadow-2 border-round">
    <div className="text-3xl font-medium text-900 mb-3">Card Title</div>
    <div className="font-medium text-500 mb-3">Vivamus id nisl interdum, blandit augue sit amet, eleifend mi.</div>
    <div style={{ height: '150px' }} className="border-2 border-dashed surface-border"></div>
</div>
    `;

    return (
        <>
            <BlockViewer header="Hero" code={block1}>
                <div className="grid grid-nogutter surface-section text-800">
                    <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
                        <section>
                            <span className="block text-6xl font-bold mb-1">Create the screens your</span>
                            <div className="text-6xl text-primary font-bold mb-3">your visitors deserve to see</div>
                            <p className="mt-0 mb-4 text-700 line-height-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

                            <Button label="Learn More" type="button" className="mr-3 p-button-raised"></Button>
                            <Button label="Live Demo" type="button" className="p-button-outlined"></Button>
                        </section>
                    </div>
                    <div className="col-12 md:col-6 overflow-hidden">
                        <img src="images/blocks/hero/hero-1.png" alt="hero-1" className="md:ml-auto block md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
                    </div>
                </div>
            </BlockViewer>

            <BlockViewer header="Feature" code={block2}>
                <div className="surface-section px-4 py-8 md:px-6 lg:px-8 text-center">
                    <div className="mb-3 font-bold text-2xl">
                        <span className="text-900">One Product, </span>
                        <span className="text-blue-600">Many Solutions</span>
                    </div>
                    <div className="text-700 text-sm mb-6">Ac turpis egestas maecenas pharetra convallis posuere morbi leo urna.</div>
                    <div className="grid">
                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block surface-card" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-desktop text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 mb-3 font-medium">Built for Developers</div>
                            <span className="text-700 text-sm line-height-3">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span>
                        </div>
                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block surface-card" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-lock text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 mb-3 font-medium">End-to-End Encryption</div>
                            <span className="text-700 text-sm line-height-3">Risus nec feugiat in fermentum posuere urna nec. Posuere sollicitudin aliquam ultrices sagittis.</span>
                        </div>
                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block surface-card" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-check-circle text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 mb-3 font-medium">Easy to Use</div>
                            <span className="text-700 text-sm line-height-3">Ornare suspendisse sed nisi lacus sed viverra tellus. Neque volutpat ac tincidunt vitae semper.</span>
                        </div>
                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block surface-card" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-globe text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 mb-3 font-medium">Fast & Global Support</div>
                            <span className="text-700 text-sm line-height-3">Fermentum et sollicitudin ac orci phasellus egestas tellus rutrum tellus.</span>
                        </div>
                        <div className="col-12 md:col-4 mb-4 px-5">
                            <span className="p-3 shadow-2 mb-3 inline-block surface-card" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-github text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 mb-3 font-medium">Open Source</div>
                            <span className="text-700 text-sm line-height-3">Nec tincidunt praesent semper feugiat. Sed adipiscing diam donec adipiscing tristique risus nec feugiat. </span>
                        </div>
                        <div className="col-12 md:col-4 md:mb-4 mb-0 px-3">
                            <span className="p-3 shadow-2 mb-3 inline-block surface-card" style={{ borderRadius: '10px' }}>
                                <i className="pi pi-shield text-4xl text-blue-500"></i>
                            </span>
                            <div className="text-900 mb-3 font-medium">Trusted Securitty</div>
                            <span className="text-700 text-sm line-height-3">Mattis rhoncus urna neque viverra justo nec ultrices. Id cursus metus aliquam eleifend.</span>
                        </div>
                    </div>
                </div>
            </BlockViewer>

            <BlockViewer header="Pricing" code={block3}>
                <div className="surface-ground px-4 py-8 md:px-6 lg:px-8">
                    <div className="text-900 font-bold text-6xl mb-4 text-center">Pricing Plans</div>
                    <div className="text-700 text-xl mb-6 text-center line-height-3">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.</div>

                    <div className="grid">
                        <div className="col-12 lg:col-4">
                            <div className="p-3 h-full">
                                <div className="shadow-2 p-3 h-full flex flex-column surface-card" style={{ borderRadius: '6px' }}>
                                    <div className="text-900 font-medium text-xl mb-2">Basic</div>
                                    <div className="text-600">Plan description</div>
                                    <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                                    <div className="flex align-items-center">
                                        <span className="font-bold text-2xl text-900">$9</span>
                                        <span className="ml-2 font-medium text-600">per month</span>
                                    </div>
                                    <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                                    <ul className="list-none p-0 m-0 flex-grow-1">
                                        <li className="flex align-items-center mb-3">
                                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                            <span>Arcu vitae elementum</span>
                                        </li>
                                        <li className="flex align-items-center mb-3">
                                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                            <span>Dui faucibus in ornare</span>
                                        </li>
                                        <li className="flex align-items-center mb-3">
                                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                            <span>Morbi tincidunt augue</span>
                                        </li>
                                    </ul>
                                    <hr className="mb-3 mx-0 border-top-1 border-none surface-border mt-auto" />
                                    <Button label="Buy Now" className="p-3 w-full mt-auto"></Button>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 lg:col-4">
                            <div className="p-3 h-full">
                                <div className="shadow-2 p-3 h-full flex flex-column surface-card" style={{ borderRadius: '6px' }}>
                                    <div className="text-900 font-medium text-xl mb-2">Premium</div>
                                    <div className="text-600">Plan description</div>
                                    <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                                    <div className="flex align-items-center">
                                        <span className="font-bold text-2xl text-900">$29</span>
                                        <span className="ml-2 font-medium text-600">per month</span>
                                    </div>
                                    <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                                    <ul className="list-none p-0 m-0 flex-grow-1">
                                        <li className="flex align-items-center mb-3">
                                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                            <span>Arcu vitae elementum</span>
                                        </li>
                                        <li className="flex align-items-center mb-3">
                                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                            <span>Dui faucibus in ornare</span>
                                        </li>
                                        <li className="flex align-items-center mb-3">
                                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                            <span>Morbi tincidunt augue</span>
                                        </li>
                                        <li className="flex align-items-center mb-3">
                                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                            <span>Duis ultricies lacus sed</span>
                                        </li>
                                    </ul>
                                    <hr className="mb-3 mx-0 border-top-1 border-none surface-border" />
                                    <Button label="Buy Now" className="p-3 w-full"></Button>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 lg:col-4">
                            <div className="p-3 h-full">
                                <div className="shadow-2 p-3 flex flex-column surface-card" style={{ borderRadius: '6px' }}>
                                    <div className="text-900 font-medium text-xl mb-2">Enterprise</div>
                                    <div className="text-600">Plan description</div>
                                    <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                                    <div className="flex align-items-center">
                                        <span className="font-bold text-2xl text-900">$49</span>
                                        <span className="ml-2 font-medium text-600">per month</span>
                                    </div>
                                    <hr className="my-3 mx-0 border-top-1 border-none surface-border" />
                                    <ul className="list-none p-0 m-0 flex-grow-1">
                                        <li className="flex align-items-center mb-3">
                                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                            <span>Arcu vitae elementum</span>
                                        </li>
                                        <li className="flex align-items-center mb-3">
                                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                            <span>Dui faucibus in ornare</span>
                                        </li>
                                        <li className="flex align-items-center mb-3">
                                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                            <span>Morbi tincidunt augue</span>
                                        </li>
                                        <li className="flex align-items-center mb-3">
                                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                            <span>Duis ultricies lacus sed</span>
                                        </li>
                                        <li className="flex align-items-center mb-3">
                                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                            <span>Imperdiet proin</span>
                                        </li>
                                        <li className="flex align-items-center mb-3">
                                            <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                            <span>Nisi scelerisque</span>
                                        </li>
                                    </ul>
                                    <hr className="mb-3 mx-0 border-top-1 border-none surface-border" />
                                    <Button label="Buy Now" className="p-3 w-full p-button-outlined"></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BlockViewer>

            <BlockViewer header="Call to Action" code={block4}>
                <div className="surface-section px-4 py-8 md:px-6 lg:px-8">
                    <div className="text-700 text-center">
                        <div className="text-blue-600 font-bold mb-3"><i className="pi pi-discord"></i>&nbsp;POWERED BY DISCORD</div>
                        <div className="text-900 font-bold text-5xl mb-3">Join Our Design Community</div>
                        <div className="text-700 text-2xl mb-5">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit numquam eligendi quos.</div>
                        <Button label="Join Now" icon="pi pi-discord" className="font-bold px-5 py-3 p-button-raised p-button-rounded white-space-nowrap"></Button>
                    </div>
                </div>
            </BlockViewer>

            <BlockViewer header="Banner" code={block5} containerClassName="surface-section py-8">
                <div className="bg-bluegray-900 text-gray-100 p-3 flex justify-content-between lg:justify-content-center align-items-center flex-wrap">
                    <div className="font-bold mr-8"><span role="img" aria-label="fire">🔥</span> Hot Deals!</div>
                    <div className="align-items-center hidden lg:flex">
                        <span className="line-height-3">Libero voluptatum atque exercitationem praesentium provident odit.</span>
                    </div>
                    <button className="p-link flex align-items-center ml-2 mr-8">
                        <span className="underline font-bold">Learn More</span>
                    </button>
                    <button className="p-ripple p-link flex align-items-center no-underline justify-content-center border-circle text-gray-50 hover:bg-bluegray-700 cursor-pointer transition-colors transition-duration-150 p-ripple" style={{ width: '2rem', height: '2rem' }}>
                        <i className="pi pi-times"></i>
                    </button>
                </div>
            </BlockViewer>

            <BlockViewer header="Page Heading" code={block6}>
                <div className="surface-section px-4 py-5 md:px-6 lg:px-8">
                    <ul className="list-none p-0 m-0 flex align-items-center font-medium mb-3">
                        <li>
                            <button className="p-link text-500 no-underline line-height-3 cursor-pointer">Application</button>
                        </li>
                        <li className="px-2">
                            <i className="pi pi-angle-right text-500 line-height-3"></i>
                        </li>
                        <li>
                            <span className="text-900 line-height-3">Analytics</span>
                        </li>
                    </ul>
                    <div className="flex align-items-start flex-column lg:justify-content-between lg:flex-row">
                        <div>
                            <div className="font-medium text-3xl text-900">Customers</div>
                            <div className="flex align-items-center text-700 flex-wrap">
                                <div className="mr-5 flex align-items-center mt-3">
                                    <i className="pi pi-users mr-2"></i>
                                    <span>332 Active Users</span>
                                </div>
                                <div className="mr-5 flex align-items-center mt-3">
                                    <i className="pi pi-globe mr-2"></i>
                                    <span>9402 Sessions</span>
                                </div>
                                <div className="flex align-items-center mt-3">
                                    <i className="pi pi-clock mr-2"></i>
                                    <span>2.32m Avg. Duration</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 lg:mt-0">
                            <Button label="Add" className="p-button-outlined mr-2" icon="pi pi-user-plus" />
                            <Button label="Save" icon="pi pi-check" />
                        </div>
                    </div>
                </div>
            </BlockViewer>

            <BlockViewer header="Stats" code={block7}>
                <div className="surface-ground px-4 py-5 md:px-6 lg:px-8">
                    <div className="grid">
                        <div className="col-12 md:col-6 lg:col-3">
                            <div className="surface-card shadow-2 p-3 border-round">
                                <div className="flex justify-content-between mb-3">
                                    <div>
                                        <span className="block text-500 font-medium mb-3">Orders</span>
                                        <div className="text-900 font-medium text-xl">152</div>
                                    </div>
                                    <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                        <i className="pi pi-shopping-cart text-blue-500 text-xl"></i>
                                    </div>
                                </div>
                                <span className="text-green-500 font-medium">24 new </span>
                                <span className="text-500">since last visit</span>
                            </div>
                        </div>
                        <div className="col-12 md:col-6 lg:col-3">
                            <div className="surface-card shadow-2 p-3 border-round">
                                <div className="flex justify-content-between mb-3">
                                    <div>
                                        <span className="block text-500 font-medium mb-3">Revenue</span>
                                        <div className="text-900 font-medium text-xl">$2.100</div>
                                    </div>
                                    <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                        <i className="pi pi-map-marker text-orange-500 text-xl"></i>
                                    </div>
                                </div>
                                <span className="text-green-500 font-medium">%52+ </span>
                                <span className="text-500">since last week</span>
                            </div>
                        </div>
                        <div className="col-12 md:col-6 lg:col-3">
                            <div className="surface-card shadow-2 p-3 border-round">
                                <div className="flex justify-content-between mb-3">
                                    <div>
                                        <span className="block text-500 font-medium mb-3">Customers</span>
                                        <div className="text-900 font-medium text-xl">28441</div>
                                    </div>
                                    <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                        <i className="pi pi-inbox text-cyan-500 text-xl"></i>
                                    </div>
                                </div>
                                <span className="text-green-500 font-medium">520  </span>
                                <span className="text-500">newly registered</span>
                            </div>
                        </div>
                        <div className="col-12 md:col-6 lg:col-3">
                            <div className="surface-card shadow-2 p-3 border-round">
                                <div className="flex justify-content-between mb-3">
                                    <div>
                                        <span className="block text-500 font-medium mb-3">Comments</span>
                                        <div className="text-900 font-medium text-xl">152 Unread</div>
                                    </div>
                                    <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                        <i className="pi pi-comment text-purple-500 text-xl"></i>
                                    </div>
                                </div>
                                <span className="text-green-500 font-medium">85 </span>
                                <span className="text-500">responded</span>
                            </div>
                        </div>
                    </div>
                </div>
            </BlockViewer>

            <BlockViewer header="Sign-In" code={block8} containerClassName="surface-ground px-4 py-8 md:px-6 lg:px-8 flex align-items-center justify-content-center">
                <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
                    <div className="text-center mb-5">
                        <img src="images/blocks/logos/hyper.svg" alt="hyper" height="50" className="mb-3" />
                        <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                        <span className="text-600 font-medium line-height-3">Don't have an account?</span>
                        <button className="p-link font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</button>
                    </div>

                    <div>
                        <label htmlFor="email1" className="block text-900 font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" className="w-full mb-3" />

                        <label htmlFor="password1" className="block text-900 font-medium mb-2">Password</label>
                        <InputText id="password1" type="password" className="w-full mb-3" />

                        <div className="flex align-items-center justify-content-between mb-6">
                            <div className="flex align-items-center">
                                <Checkbox inputId="rememberme1" binary className="mr-2" onChange={e => setChecked(e.checked)} checked={checked} />
                                <label htmlFor="rememberme1">Remember me</label>
                            </div>
                            <button className="p-link font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot password?</button>
                        </div>

                        <Button label="Sign In" icon="pi pi-user" className="w-full" />
                    </div>
                </div>
            </BlockViewer>

            <BlockViewer header="Description List" code={block9} containerClassName="surface-section px-4 py-8 md:px-6 lg:px-8">
                <div className="surface-section">
                    <div className="font-medium text-3xl text-900 mb-3">Movie Information</div>
                    <div className="text-500 mb-5">Morbi tristique blandit turpis. In viverra ligula id nulla hendrerit rutrum.</div>
                    <ul className="list-none p-0 m-0">
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                            <div className="text-500 w-6 md:w-2 font-medium">Title</div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">Heat</div>
                            <div className="w-6 md:w-2 flex justify-content-end">
                                <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                            <div className="text-500 w-6 md:w-2 font-medium">Genre</div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                <Chip label="Crime" className="mr-2"></Chip>
                                <Chip label="Drama" className="mr-2"></Chip>
                                <Chip label="Thriller"></Chip>
                            </div>
                            <div className="w-6 md:w-2 flex justify-content-end">
                                <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                            <div className="text-500 w-6 md:w-2 font-medium">Director</div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">Michael Mann</div>
                            <div className="w-6 md:w-2 flex justify-content-end">
                                <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 surface-border flex-wrap">
                            <div className="text-500 w-6 md:w-2 font-medium">Actors</div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">Robert De Niro, Al Pacino</div>
                            <div className="w-6 md:w-2 flex justify-content-end">
                                <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
                            </div>
                        </li>
                        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 surface-border flex-wrap">
                            <div className="text-500 w-6 md:w-2 font-medium">Plot</div>
                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
                                A group of professional bank robbers start to feel the heat from police
                                when they unknowingly leave a clue at their latest heist.</div>
                            <div className="w-6 md:w-2 flex justify-content-end">
                                <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
                            </div>
                        </li>
                    </ul>
                </div>
            </BlockViewer>

            <BlockViewer header="Card" code={block10} containerClassName="px-4 py-8 md:px-6 lg:px-8">
                <div className="surface-card p-4 shadow-2 border-round">
                    <div className="text-3xl font-medium text-900 mb-3">Card Title</div>
                    <div className="font-medium text-500 mb-3">Vivamus id nisl interdum, blandit augue sit amet, eleifend mi.</div>
                    <div style={{ height: '150px' }} className="border-2 border-dashed surface-border"></div>
                </div>
            </BlockViewer>
        </>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(BlocksDemo, comparisonFn);