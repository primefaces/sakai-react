import React, { useState, useEffect, useRef } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import { AvatarGroup } from 'primereact/avatargroup';
import { Chip } from 'primereact/chip';
import { Skeleton } from 'primereact/skeleton';
import { ScrollPanel } from 'primereact/scrollpanel';
import { ScrollTop } from 'primereact/scrolltop';

const MiscDemo = () => {
    const [value, setValue] = useState(0);
    const interval = useRef(null);

    useEffect(() => {
        let val = value;
        interval.current = setInterval(() => {
            val += Math.floor(Math.random() * 10) + 1;

            if (val >= 100) {
                val = 100;
                clearInterval(interval.current);
            }
            setValue(val);
        }, 2000);

        return () => {
            if (interval.current) {
                clearInterval(interval.current);
                interval.current = null;
            }
        };
    }, [value]);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>ProgressBar</h5>
                    <div className="grid">
                        <div className="col">
                            <ProgressBar value={value} />
                        </div>
                        <div className="col">
                            <ProgressBar value="50" showValue={false} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 lg:col-6">
                <div className="card">
                    <h4>Badge</h4>
                    <h5>Numbers</h5>
                    <div className="flex flex-wrap gap-2">
                        <Badge value="2"></Badge>
                        <Badge value="8" severity="success"></Badge>
                        <Badge value="4" severity="info"></Badge>
                        <Badge value="12" severity="warning"></Badge>
                        <Badge value="3" severity="danger"></Badge>
                    </div>

                    <h5>Positioned Badge</h5>
                    <div className="flex flex-wrap gap-2">
                        <i className="pi pi-bell mr-4 p-text-secondary p-overlay-badge" style={{ fontSize: '2rem' }}>
                            <Badge value="2"></Badge>
                        </i>
                        <i className="pi pi-calendar mr-4 p-text-secondary p-overlay-badge" style={{ fontSize: '2rem' }}>
                            <Badge value="10+" severity="danger"></Badge>
                        </i>
                        <i className="pi pi-envelope p-text-secondary p-overlay-badge" style={{ fontSize: '2rem' }}>
                            <Badge severity="danger"></Badge>
                        </i>
                    </div>

                    <h5>Button Badge</h5>
                    <div className="flex flex-wrap gap-2">
                        <Button type="button" label="Emails">
                            <Badge value="8"></Badge>
                        </Button>
                        <Button type="button" label="Messages" icon="pi pi-users" severity="warning">
                            <Badge value="8" severity="danger"></Badge>
                        </Button>
                    </div>
                    <h5>Sizes</h5>
                    <div className="flex flex-wrap gap-2 align-items-end">
                        <Badge value="2"></Badge>
                        <Badge value="4" size="large" severity="warning"></Badge>
                        <Badge value="6" size="xlarge" severity="success"></Badge>
                    </div>
                </div>

                <div className="card">
                    <h4>Avatar</h4>
                    <h5>Avatar Group</h5>
                    <AvatarGroup className="mb-3">
                        <Avatar image={`/demo/images/avatar/amyelsner.png`} size="large" shape="circle"></Avatar>
                        <Avatar image={`/demo/images/avatar/asiyajavayant.png`} size="large" shape="circle"></Avatar>
                        <Avatar image={`/demo/images/avatar/onyamalimba.png`} size="large" shape="circle"></Avatar>
                        <Avatar image={`/demo/images/avatar/ionibowcher.png`} size="large" shape="circle"></Avatar>
                        <Avatar image={`/demo/images/avatar/xuxuefeng.png`} size="large" shape="circle"></Avatar>
                        <Avatar label="+2" shape="circle" size="large" style={{ backgroundColor: '#9c27b0', color: '#ffffff' }}></Avatar>
                    </AvatarGroup>

                    <h5>Label - Circle</h5>
                    <div className="flex flex-wrap gap-2 align-items-end">
                        <Avatar label="P" size="xlarge" shape="circle"></Avatar>
                        <Avatar label="V" size="large" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} shape="circle"></Avatar>
                        <Avatar label="U" style={{ backgroundColor: '#9c27b0', color: '#ffffff' }} shape="circle"></Avatar>
                    </div>

                    <h5>Icon - Badge</h5>
                    <Avatar className="p-overlay-badge" icon="pi pi-user" size="xlarge">
                        <Badge value="4" />
                    </Avatar>
                </div>

                <div className="card">
                    <h4>ScrollTop</h4>
                    <ScrollPanel style={{ width: '250px', height: '200px' }}>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae et leo duis ut diam. Ultricies mi quis hendrerit dolor magna eget est lorem. Amet
                            consectetur adipiscing elit ut. Nam libero justo laoreet sit amet. Pharetra massa massa ultricies mi quis hendrerit dolor magna. Est ultricies integer quis auctor elit sed vulputate. Consequat ac felis donec et. Tellus
                            orci ac auctor augue mauris. Semper feugiat nibh sed pulvinar proin gravida hendrerit lectus a. Tincidunt arcu non sodales neque sodales. Metus aliquam eleifend mi in nulla posuere sollicitudin aliquam ultrices. Sodales ut
                            etiam sit amet nisl purus. Cursus sit amet dictum sit amet. Tristique senectus et netus et malesuada fames ac turpis egestas. Et tortor consequat id porta nibh venenatis cras sed. Diam maecenas ultricies mi eget mauris.
                            Eget egestas purus viverra accumsan in nisl nisi. Suscipit adipiscing bibendum est ultricies integer. Mattis aliquam faucibus purus in massa tempor nec.
                        </p>
                        <ScrollTop target="parent" className="custom-scrolltop" threshold={100} icon="pi pi-arrow-up"></ScrollTop>
                    </ScrollPanel>
                </div>
            </div>
            <div className="col-12 lg:col-6">
                <div className="card">
                    <h4>Tag</h4>
                    <h5>Tags</h5>
                    <div className="flex flex-wrap gap-2">
                        <Tag value="Primary"></Tag>
                        <Tag severity="success" value="Success"></Tag>
                        <Tag severity="info" value="Info"></Tag>
                        <Tag severity="warning" value="Warning"></Tag>
                        <Tag severity="danger" value="Danger"></Tag>
                    </div>

                    <h5>Pills</h5>
                    <div className="flex flex-wrap gap-2">
                        <Tag value="Primary" rounded></Tag>
                        <Tag severity="success" value="Success" rounded></Tag>
                        <Tag severity="info" value="Info" rounded></Tag>
                        <Tag severity="warning" value="Warning" rounded></Tag>
                        <Tag severity="danger" value="Danger" rounded></Tag>
                    </div>

                    <h5>Icons</h5>
                    <div className="flex flex-wrap gap-2">
                        <Tag icon="pi pi-user" value="Primary"></Tag>
                        <Tag icon="pi pi-check" severity="success" value="Success"></Tag>
                        <Tag icon="pi pi-info-circle" severity="info" value="Info"></Tag>
                        <Tag icon="pi pi-exclamation-triangle" severity="warning" value="Warning"></Tag>
                        <Tag icon="pi pi-times" severity="danger" value="Danger"></Tag>
                    </div>
                </div>

                <div className="card">
                    <h4>Chip</h4>
                    <h5>Basic</h5>
                    <div className="flex flex-wrap align-items-center gap-2">
                        <Chip label="Action" />
                        <Chip label="Comedy" />
                        <Chip label="Mystery" />
                        <Chip label="Thriller" removable />
                    </div>

                    <h5>Icon</h5>
                    <div className="flex align-items-center flex-wrap gap-1">
                        <Chip label="Apple" icon="pi pi-apple" />
                        <Chip label="Facebook" icon="pi pi-facebook" />
                        <Chip label="Google" icon="pi pi-google" />
                        <Chip label="Microsoft" icon="pi pi-microsoft" removable />
                    </div>

                    <h5>Image</h5>
                    <div className="flex align-items-center flex-wrap gap-1">
                        <Chip label="Amy Elsner" image={`/demo/images/avatar/amyelsner.png`} />
                        <Chip label="Asiya Javayant" image={`/demo/images/avatar/asiyajavayant.png`} />
                        <Chip label="Onyama Limba" image={`/demo/images/avatar/onyamalimba.png`} />
                        <Chip label="Xuxue Feng" image={`/demo/images/avatar/xuxuefeng.png`} removable />
                    </div>

                    <h5>Styling</h5>
                    <div className="flex align-items-center flex-wrap gap-1 custom-chip">
                        <Chip label="Action" />
                        <Chip label="Apple" icon="pi pi-apple" />
                        <Chip label="Onyama Limba" image={`/demo/images/avatar/onyamalimba.png`} />
                        <Chip label="Xuxue Feng" image={`/demo/images/avatar/xuxuefeng.png`} removable />
                    </div>
                </div>

                <div className="card">
                    <h4>Skeleton</h4>
                    <div className="border-round border-1 surface-border p-4">
                        <div className="flex mb-3">
                            <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                            <div>
                                <Skeleton width="10rem" className="mb-2"></Skeleton>
                                <Skeleton width="5rem" className="mb-2"></Skeleton>
                                <Skeleton height=".5rem"></Skeleton>
                            </div>
                        </div>
                        <Skeleton width="100%" height="150px"></Skeleton>
                        <div className="flex justify-content-between mt-3">
                            <Skeleton width="4rem" height="2rem"></Skeleton>
                            <Skeleton width="4rem" height="2rem"></Skeleton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiscDemo;
