import React, { useState } from 'react';
import Link from 'next/link';
import { Card, Container, Divider, Grid, input, Segment } from 'semantic-ui-react'
import { useForm } from 'react-hook-form';
import { Checkbox } from 'primereact/checkbox';
import { Accordion, AccordionTab } from 'primereact/accordion';


const Manitou = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);
    console.log(errors);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="surface-0 p-4 shadow-2 border-round box">
                <h2>Manitou</h2>
                <div className="font-medium text-500 mb-3">Customer Information</div>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <div class="group">
                                <input placeholder="Name" type="text"{...register("name", { required: true, maxLength: 80 })} />
                            </div>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <input type="tel" placeholder="phone" {...register("phone", { required: true, maxLength: 100 })} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <input type="email" width={8} placeholder="Email" {...register("Email", { pattern: /^\S+@\S+$/i })} />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <input type="text" placeholder="address" {...register("address", {})} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
            <Divider hidden />
            <Divider hidden />
            <Segment raised>
                <div>
                    <h2>Model Selection</h2>
                    <div className="field col-12 md:col-12">
                        <input
                            className="px-4 py-3 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
                            list="datalistOptions"
                            id="model"
                            name="model"
                            placeholder="Type to search..."
                            style={{ width: "600px" }}
                            {...register("model", {})} />
                        <datalist id="datalistOptions">
                            <option value="cruise bench 20 s115hp" />
                            <option value="cruise bench 20 s150hp" />
                            <option value="cruise bench 22 s115hp" />
                            <option value="cruise bench 22 s150hp" />
                            <option value="cruise switchback 22 s115hp" />
                            <option value="cruise switchback 22 s150hp" />
                            <option value="cruise switchback 24 s115hp" />
                            <option value="cruise switchback 24 s150hp" />
                            <option value="explore bench 22" />
                            <option value="explore bench 22 trifold bench" />
                            <option value="explore bench 22 s115hp" />
                            <option value="explore bench 22 s115hp trifold bench" />
                            <option value="explore bench 22 s150hp" />
                            <option value="explore bench 22 s150hp trifold bench" />
                            <option value="explore navigator 22 trifold bench" />
                            <option value="explore navigator 22 s115hp trifold bench" />
                            <option value="explore navigator 22 s150hp trifold bench" />
                            <option value="explore navigator 24 25x27x25 trifold bench" />
                            <option value="explore navigator 24 dual motor trifold bench" />
                            <option value="explore navigator 24 trifold bench" />
                            <option value="explore navigator 24 s115hp trifold bench" />
                            <option value="explore navigator 24 s150hp trifold bench" />
                            <option value="explore navigator 26 25x27x25 trifold bench" />
                            <option value="explore navigator 26 dual motor trifold bench" />
                            <option value="explore navigator 26 s115hp trifold bench" />
                            <option value="explore navigator 26 s150hp trifold bench" />
                            <option value="explore switchback 22 trifold bench" />
                            <option value="explore switchback 22 s115hp trifold bench" />
                            <option value="explore switchback 22 s150hp trifold bench" />
                            <option value="explore switchback 24 25x27x25 trifold bench" />
                            <option value="explore switchback 24 dual motor trifold bench" />
                            <option value="explore switchback 24 trifold bench" />
                            <option value="explore switchback 24 s115hp trifold bench" />
                            <option value="explore switchback 24 s150hp trifold bench" />
                            <option value="explore switchback 26 25x27x25 trifold bench" />
                            <option value="explore switchback 26 dual motor trifold bench" />
                            <option value="explore switchback 26 s115hp trifold bench" />
                            <option value="explore switchback 26 s150hp trifold bench" />
                            <option value="lx rfx 23" />
                            <option value="lx rfx 23" />
                            <option value="lx rfx 23" />
                            <option value="lx rfx 23 dual motor" />
                            <option value="lx rfx 23 dual motor" />
                            <option value="lx rfx 23 dual motor" />
                            <option value="lx rfx 25" />
                            <option value="lx rfx 25" />
                            <option value="lx rfx 25" />
                            <option value="lx rfx 25 dual motor" />
                            <option value="lx rfx 25 dual motor" />
                            <option value="lx rfx 25 dual motor" />
                            <option value="lx rfx 27" />
                            <option value="lx rfx 27" />
                            <option value="lx rfx 27" />
                            <option value="lx rfx 27 dual motor" />
                            <option value="lx rfx 27 dual motor" />
                            <option value="lx rfx 27 dual motor" />
                            <option value="lx rfxw 23" />
                            <option value="lx rfxw 23" />
                            <option value="lx rfxw 23" />
                            <option value="lx rfxw 23 dual motor" />
                            <option value="lx rfxw 23 dual motor" />
                            <option value="lx rfxw 23 dual motor" />
                            <option value="lx rfxw 25" />
                            <option value="lx rfxw 25" />
                            <option value="lx rfxw 25" />
                            <option value="lx rfxw 25 dual motor" />
                            <option value="lx rfxw 25 dual motor" />
                            <option value="lx rfxw 25 dual motor" />
                            <option value="lx rfxw 27" />
                            <option value="lx rfxw 27" />
                            <option value="lx rfxw 27" />
                            <option value="lx rfxw 27 dual motor" />
                            <option value="lx rfxw 27 dual motor" />
                            <option value="lx rfxw 27 dual motor" />
                            <option value="lx srs 23" />
                            <option value="lx srs 23" />
                            <option value="lx srs 23" />
                            <option value="lx srs 23 dual motor" />
                            <option value="lx srs 23 dual motor" />
                            <option value="lx srs 23 dual motor" />
                            <option value="lx srs 25" />
                            <option value="lx srs 25" />
                            <option value="lx srs 25" />
                            <option value="lx srs 25 dual motor" />
                            <option value="lx srs 25 dual motor" />
                            <option value="lx srs 25 dual motor" />
                            <option value="lx srs 27" />
                            <option value="lx srs 27" />
                            <option value="lx srs 27" />
                            <option value="lx srs 27 dual motor" />
                            <option value="lx srs 27 dual motor" />
                            <option value="lx srs 27 dual motor" />
                            <option value="lx srw 23" />
                            <option value="lx srw 23" />
                            <option value="lx srw 23" />
                            <option value="lx srw 23 dual motor" />
                            <option value="lx srw 23 dual motor" />
                            <option value="lx srw 23 dual motor" />
                            <option value="lx srw 25" />
                            <option value="lx srw 25" />
                            <option value="lx srw 25" />
                            <option value="lx srw 25 dual motor" />
                            <option value="lx srw 25 dual motor" />
                            <option value="lx srw 25 dual motor" />
                            <option value="lx srw 27" />
                            <option value="lx srw 27" />
                            <option value="lx srw 27" />
                            <option value="lx srw 27 dual motor" />
                            <option value="lx srw 27 dual motor" />
                            <option value="lx srw 27 dual motor" />
                            <option value="xt rfx 23" />
                            <option value="xt rfx 23" />
                            <option value="xt rfx 23 dual motor" />
                            <option value="xt rfx 23 dual motor" />
                            <option value="xt rfx 25" />
                            <option value="xt rfx 25" />
                            <option value="xt rfx 25 dual motor" />
                            <option value="xt rfx 25 dual motor" />
                            <option value="xt rfx 27" />
                            <option value="xt rfx 27" />
                            <option value="xt rfx 27 dual motor" />
                            <option value="xt rfx 27 dual motor" />
                            <option value="xt rfxw 23" />
                            <option value="xt rfxw 23" />
                            <option value="xt rfxw 23 dual motor" />
                            <option value="xt rfxw 23 dual motor" />
                            <option value="xt rfxw 25" />
                            <option value="xt rfxw 25" />
                            <option value="xt rfxw 25 dual motor" />
                            <option value="xt rfxw 25 dual motor" />
                            <option value="xt rfxw 27" />
                            <option value="xt rfxw 27" />
                            <option value="xt rfxw 27 dual motor" />
                            <option value="xt rfxw 27 dual motor" />
                            <option value="xt srs 23" />
                            <option value="xt srs 23" />
                            <option value="xt srs 23 dual motor" />
                            <option value="xt srs 23 dual motor" />
                            <option value="xt srs 25" />
                            <option value="xt srs 25" />
                            <option value="xt srs 25 dual motor" />
                            <option value="xt srs 25 dual motor" />
                            <option value="xt srs 27" />
                            <option value="xt srs 27" />
                            <option value="xt srs 27 dual motor" />
                            <option value="xt srs 27 dual motor" />
                            <option value="xt srw 23" />
                            <option value="xt srw 23" />
                            <option value="xt srw 23 dual motor" />
                            <option value="xt srw 23 dual motor" />
                            <option value="xt srw 25" />
                            <option value="xt srw 25" />
                            <option value="xt srw 25 dual motor" />
                            <option value="xt srw 25 dual motor" />
                            <option value="xt srw 27" />
                            <option value="xt srw 27" />
                            <option value="xt srw 27 dual motor" />
                            <option value="xt srw 27 dual motor" />
                        </datalist>
                    </div>
                </div>
            </Segment>
            <Segment raised>

                <h2>Vehicle Information</h2>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <input type="text" placeholder="stockNum" {...register("stockNum", {})} />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <input type="number" placeholder="year" {...register("year", { maxLength: 4 })} />

                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <input type="text" placeholder="trade(details)" {...register("trade(details)", {})} />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <input type="text" placeholder="deposit" {...register("deposit", {})} />

                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <input type="number" placeholder="labour (total hours)" {...register("labour (total hours)", {})} />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <input type="number" placeholder="accessories (pre tax)" {...register("accessories (pre tax)", {})} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <textarea placeholder="options" {...register("options", {})} />
            </Segment>

            <Segment raised>
                <h2>Model Options</h2>
            </Segment>

            <div className="card">
            <h3>Cruise</h3>
                <Accordion activeIndex={0}>
                    <AccordionTab header="Optional Equipment">
                        <div>garmin canadian maps</div>
                        <input type="checkbox" placeholder="garmin canadian maps" {...register("garmin canadian maps", {})} />
                        <div>marine battery</div>
                        <input type="checkbox" placeholder="marine battery" {...register("marine battery", {})} />
                        <div>sport bimini</div>
                        <input type="checkbox" placeholder="sport bimini" {...register("sport bimini", {})} />
                        <div>signature pkg</div>
                            <input type="checkbox" placeholder="signature pkg" {...register("signature pkg", {})} />
                    </AccordionTab>
                    <AccordionTab header="Color">
                        <Segment raised>

                            <select {...register("Color")}>
                                <option value="stone red - interior">stone red - interior</option>
                                <option value=" stone red - interior"> stone red - interior</option>
                                <option value=" carbon - interior"> carbon - interior</option>
                                <option value=" pearl ice - interior"> pearl ice - interior</option>
                                <option value=" carbon blue - interior"> carbon blue - interior</option>
                                <option value=" carbon red - interior"> carbon red - interior</option>
                                <option value=" stone red - interior"> stone red - interior</option>
                                <option value=" stone red - interior"> stone red - interior</option>
                                <option value=" carbon - interior"> carbon - interior</option>
                                <option value=" pearl ice - interior"> pearl ice - interior</option>
                                <option value=" carbon blue - interior"> carbon blue - interior</option>
                                <option value=" carbon red - interior"> carbon red - interior</option>
                            </select>
                        </Segment>
                    </AccordionTab>
                </Accordion>
            </div>

            <div className="card">
            <h3>Explore</h3>
                <Accordion activeIndex={0}>
                    <AccordionTab header="Optional Equipment">
                        <div>
                        <a>garmin canadian maps</a>
                        <input type="checkbox" placeholder="garmin canadian maps" {...register("garmin canadian maps", {})} />
                        </div>
                        <div>marine battery</div>
                        <input type="checkbox" placeholder="marine battery" {...register("marine battery", {})} />
                        <div>sport bimini</div>
                        <input type="checkbox" placeholder="sport bimini" {...register("sport bimini", {})} />
                        <div>signature pkg</div>
                            <input type="checkbox" placeholder="signature pkg" {...register("signature pkg", {})} />
                    </AccordionTab>
                    <AccordionTab header="Color">
                        <Segment raised>

                            <select {...register("Color")}>
                                <option value="stone red - interior">stone red - interior</option>
                                <option value=" stone red - interior"> stone red - interior</option>
                                <option value=" carbon - interior"> carbon - interior</option>
                                <option value=" pearl ice - interior"> pearl ice - interior</option>
                                <option value=" carbon blue - interior"> carbon blue - interior</option>
                                <option value=" carbon red - interior"> carbon red - interior</option>
                                <option value=" stone red - interior"> stone red - interior</option>
                                <option value=" stone red - interior"> stone red - interior</option>
                                <option value=" carbon - interior"> carbon - interior</option>
                                <option value=" pearl ice - interior"> pearl ice - interior</option>
                                <option value=" carbon blue - interior"> carbon blue - interior</option>
                                <option value=" carbon red - interior"> carbon red - interior</option>
                            </select>
                        </Segment>
                    </AccordionTab>
                </Accordion>
            </div>






            <Segment raised>
                <input class="button" type="submit" />
            </Segment>
        </form>







    );
}

export default Manitou;
