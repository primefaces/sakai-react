import React, { useState } from 'react';
import Link from 'next/link';
import { Container, Divider, Grid, input, Segment } from 'semantic-ui-react'
import './backdrop.jpg'
import { useForm } from 'react-hook-form';




const imstyle = {
    clipPath: "polygon(8% 0, 100% 0%, 100% 100%, 0 100%)"
}


const EmptyPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);
    console.log(errors);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="surface-0 p-4 shadow-2 border-round box">
                <h2>BRP</h2>
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
                            <option value="outlander 450 viper red 5APA" />
                            <option value="outlander 450 tundra green 5APB" />
                            <option value="outlander 570 viper red 2TPA" />
                            <option value="outlander 570 tundra green 2TPB" />
                            <option value="outlander dps 450 granite gray 2WPA" />
                            <option value="outlander dps 450 tundra green 2WPB" />
                            <option value="outlander dps 450 mossy oak break-up country camo 2WPC" />
                            <option value="outlander dps 570 granite gray 2CPA" />
                            <option value="outlander dps 570 tundra green 2CPB" />
                            <option value="outlander dps 570 mossy oak break-up country camo 2CPC" />
                            <option value="outlander xt 570 boreal green 2UPA" />
                            <option value="outlander xt 570 oxford blue 2UPB" />
                            <option value="outlander hunting edition 450 mossy oak break-up country camo 2VPA" />
                            <option value="outlander hunting edition 570 mossy oak break-up country camo 3ZPA" />
                            <option value="outlander mr 570 viper red 1RPA" />
                            <option value="outlander x mr 570 desert tan 3MPA" />
                            <option value="outlander 500 2wd legion red 1KPB" />
                            <option value="outlander 500 granite gray 1BPA" />
                            <option value="outlander 500 legion red 1BPB" />
                            <option value="outlander 700 granite gray 1CPA" />
                            <option value="outlander 700 legion red 1CPB" />
                            <option value="outlander dps 500 granite gray 1DPA" />
                            <option value="outlander dps 500 legion red 1DPB" />
                            <option value="outlander dps 500 wildland camo 1DPC" />
                            <option value="outlander dps 700 granite gray 1EPA" />
                            <option value="outlander dps 700 legion red 1EPB" />
                            <option value="outlander dps 700 wildland camo 1EPC" />
                            <option value="outlander xt 700 platinum satin 1GPA" />
                            <option value="outlander xt 700 neo yellow 1GPB" />
                            <option value="outlander pro hd5 desert tan 1HPA" />
                            <option value="outlander pro hd5 tundra green 1HPF" />
                            <option value="outlander pro hd7 desert tan 1JPA" />
                            <option value="outlander pro hd7 tundra green 1JPB" />
                            <option value="outlander pro xu hd5 desert tan 1LPA" />
                            <option value="outlander pro xu hd5 tundra green 1LPB" />
                            <option value="outlander pro xu hd7 desert tan 1MPA" />
                            <option value="outlander pro xu hd7 tundra green 1MPB" />
                            <option value="outlander pro hunting edition hd5 wildland camo 1NPA" />
                            <option value="outlander pro hunting edition hd7 wildland camo 1PPA" />
                            <option value="outlander max dps 500 granite gray 1VPA" />
                            <option value="outlander max dps 500 legion red 1VPB" />
                            <option value="outlander max dps 700 granite gray 1WPA" />
                            <option value="outlander max dps 700 legion red 1WPB" />
                            <option value="outlander max xt 700 platinum satin 1YPA" />
                            <option value="outlander max xt 700 neo yellow 1YPB" />
                            <option value="outlander 850 viper red 2HPA" />
                            <option value="outlander dps 850 granite gray 2APE" />
                            <option value="outlander xt 850 mossy oak break-up country camo 2JPD" />
                            <option value="outlander xt 850 platinum satin 2JPE" />
                            <option value="outlander xt 850 oxford blue 2JPF" />
                            <option value="outlander xt 1000r platinum satin 5TPD" />
                            <option value="outlander xt 1000r oxford blue 5TPE" />
                            <option value="outlander xt 1000r mossy oak break-up country camo 5TPF" />
                            <option value="outlander xt-p 850 iron gray & neo yellow 5RPB" />
                            <option value="outlander xt-p 1000r iron gray & neo yellow 5XPA" />
                            <option value="outlander x xc 1000r chalk gray & can-am red 4MPA" />
                            <option value="outlander hunting edition 850 mossy oak break-up country camo 4SPA" />
                            <option value="outlander x mr 850 desert tan 4KPA" />
                            <option value="outlander x mr 1000r desert tan 5KPA" />
                            <option value="outlander x mr 1000r liquid titanium & can-am red 5KPB" />
                            <option value="outlander max 450 viper red 5CPA" />
                            <option value="outlander max 570 viper red 2EPA" />
                            <option value="outlander max dps 450 granite gray 2XPA" />
                            <option value="outlander max dps 450 tundra green 2XPB" />
                            <option value="outlander max dps 570 granite gray 2FPA" />
                            <option value="outlander max dps 570 tundra green 2FPB" />
                            <option value="outlander max xt 570 oxford blue 2GPA" />
                            <option value="outlander max xt 570 boreal green 2GPB" />
                            <option value="outlander max dps 850 granite gray 2DPB" />
                            <option value="outlander max xt 850 platinum satin 2LPE" />
                            <option value="outlander max xt 850 mossy oak break-up country camo 2LPF" />
                            <option value="outlander max xt 850 oxford blue 2LPG" />
                            <option value="outlander max xt 1000r platinum satin 5UPC" />
                            <option value="outlander max xt 1000r oxford blue 5UPD" />
                            <option value="outlander max xt-p 850 iron gray & neo yellow 5FPC" />
                            <option value="outlander max xt-p 1000r iron gray & neo yellow 5JPD" />
                            <option value="outlander max limited 1000r stone gray 5WPA" />
                            <option value="outlander max 6x6 dps 450 tundra green 4ZPA" />
                            <option value="outlander max 6x6 dps 650 tundra green 5YPA" />
                            <option value="outlander max 6x6 max xt 1000 boreal green 5ZPA" />
                            <option value="renegade x mr 650 catalyst gray & neo yellow 0004TPA00" />
                            <option value="renegade x xc 1000r catalyst gray & neo yellow 0005VPA00" />
                            <option value="renegade x mr 1000r catalyst gray & neo yellow 0004FPA00" />
                            <option value="renegade x mr 1000r liquid titanium & can-am red 0004FPB00" />
                            <option value="renegade 70 efi catalyst gray & neo yellow 0003KPA00" />
                            <option value="renegade 70 efi iceberg blue & black 0003KPB00" />
                            <option value="renegade 110 efi catalyst gray & neo yellow 0003CPA00" />
                            <option value="renegade 110 efi iceberg blue & black 0003CPB00" />
                            <option value="renegade x xc 110 efi black & legion red 0003LPA00" />
                            <option value="ds 250 black & can-am red 0003JPA00" />
                            <option value="defender hd7 tundra green 0006XPB00" />
                            <option value="defender dps™ hd7 tundra green 0008WPB00" />
                            <option value="defender dps hd7 mossy oak break-up country camo 0008WPD00" />
                            <option value="defender hd9 tundra green 0006WPB00" />
                            <option value="defender dps hd9 tundra green 0008EPB00" />
                            <option value="defender dps hd9 oxford blue 0008EPD00" />
                            <option value="defender dps hd9 timeless black 0008EPF00" />
                            <option value="defender dps hd9 mossy oak break-up country camo 0008EPH00" />
                            <option value="defender xt™ hd9 oxford blue 0008FPB00" />
                            <option value="defender xt hd9 stone gray 0008FPD00" />
                            <option value="defender xt hd9 timeless black 0008FPF00" />
                            <option value="defender xt hd9 mossy oak break-up country camo 0008FPH00" />
                            <option value="defender dps cab hd9 tundra green 0008UPB00" />
                            <option value="defender dps hd10 tundra green 0008BPB00" />
                            <option value="defender dps hd10 oxford blue 0008BPD00" />
                            <option value="defender dps hd10 timeless black 0008BPF00" />
                            <option value="defender xt hd10 oxford blue 0008CPB00" />
                            <option value="defender xt hd10 stone gray 0008CPD00" />
                            <option value="defender xt hd10 timeless black 0008CPF00" />
                            <option value="defender xt hd10 mossy oak break-up country camo 0008CPH00" />
                            <option value="defender x mr hd10 liquid titanium & magma red 0008YPB00" />
                            <option value="defender x mr hd10 mossy oak break-up country camo 0008YPC00" />
                            <option value="defender x mr hd10 with half doors liquid titanium & magma red 0008YPA00" />
                            <option value="defender limited cab hd10 oxford blue 0008JPB00" />
                            <option value="defender limited cab hd10 stone gray 0008JPD00" />
                            <option value="defender limited cab hd10 desert tan & timeless black 0008JPH00" />
                            <option value="defender limited cab hd10 mossy oak break-up country camo 0008JPF00" />
                            <option value="defender max hd7 tundra green 0008ZPB00" />
                            <option value="defender max hd9 tundra green 0008DPB00" />
                            <option value="defender max dps hd7 tundra green 0008PPD00" />
                            <option value="defender max dps hd9 tundra green 0008RPB00" />
                            <option value="defender max dps hd9 timeless black 0008RPD00" />
                            <option value="defender max dps hd9 mossy oak break-up country camo 0008RPF00" />
                            <option value="defender max xt hd9 oxford blue 0008SPB00" />
                            <option value="defender max xt hd9 stone gray 0008SPD00" />
                            <option value="defender max xt hd9 mossy oak break-up country camo 0008SPF00" />
                            <option value="defender max dps hd10 oxford blue 0008LPB00" />
                            <option value="defender max dps hd10 timeless black 0008LPD00" />
                            <option value="defender max xt hd10 oxford blue 0008MPB00" />
                            <option value="defender max xt hd10 stone gray 0008MPD00" />
                            <option value="defender max xt hd10 mossy oak break-up country camo 0008MPF00" />
                            <option value="defender max lone star hd10 night black 0006UPA00" />
                            <option value="defender max x mr mossy oak break-up country camo 0008PPB00" />
                            <option value="defender max x mr with half doors liquid titanium & magma red 0008PPA00" />
                            <option value="defender max limited cab hd10 oxford blue 0006MPB00" />
                            <option value="defender max limited cab hd10 stone gray 0006MPD00" />
                            <option value="defender max limited cab hd10 desert tan & timeless black 0006MPH00" />
                            <option value="defender max limited cab hd10 mossy oak break-up country camo 0006MPF00" />
                            <option value="defender max lone star cab hd10 night black 0006LPA00" />
                            <option value="defender pro dps hd10 tundra green 0006APB00" />
                            <option value="defender pro xt hd10 timeless black 0006EPD00" />
                            <option value="defender pro limited cab hd10 stone gray 0009HPD00" />
                            <option value="defender 6x6 dps hd10 tundra green 0009VPA00" />
                            <option value="defender 6x6 xt hd10 oxford blue 0009RPA00" />
                            <option value="defender 6x6 limited cab hd10 oxford blue 0009SPA00" />
                            <option value="maverick trail 700 catalyst gray 0007RPB00" />
                            <option value="maverick trail dps 700 triple black 0007HPB00" />
                            <option value="maverick trail dps 1000 triple black 0007FPF00" />
                            <option value="maverick trail dps 1000 oxford blue 0007FPB00" />
                            <option value="maverick trail dps 1000 mossy oak break-up country camo 0007FPD00" />
                            <option value="maverick sport dps 1000r oxford blue 0009GPB00" />
                            <option value="maverick sport dps 1000r triple black 0009GPD00" />
                            <option value="maverick sport x xc 1000r desert tan & carbon black 0007CPB00" />
                            <option value="maverick sport x mr 1000r liquid titanium & magma red 0006FPA00" />
                            <option value="maverick sport x rc 1000r mineral gray & desert tan 0007BPB00" />
                            <option value="maverick sport max dps 1000r triple black 0009JPB00" />
                            <option value="maverick x3 ds turbo catalyst gray 0009DPH00" />
                            <option value="maverick x3 ds turbo octane blue 0009DPB00" />
                            <option value="maverick x3 ds turbo desert tan & carbon black 0009DPF00" />
                            <option value="maverick x3 ds turbo rr catalyst gray 0007XPF00" />
                            <option value="maverick x3 ds turbo rr octane blue 0007XPB00" />
                            <option value="maverick x3 ds turbo rr desert tan & carbon black 0007XPD00" />
                            <option value="maverick x3 rs turbo rr catalyst gray 0009EPF00" />
                            <option value="maverick x3 rs turbo rr octane blue 0009EPB00" />
                            <option value="maverick x3 rs turbo rr desert tan & carbon black 0009EPD00" />
                            <option value="maverick x3 x ds turbo rr triple black 0007SPF00" />
                            <option value="maverick x3 x ds turbo rr desert tan, carbon black & magma red 0007SPB00" />
                            <option value="maverick x3 x rs turbo rr triple black 0007TPF00" />
                            <option value="maverick x3 x rs turbo rr desert tan, carbon black & magma red 0007TPB00" />
                            <option value="maverick x3 x rs turbo rr intense blue, carbon black & chalk gray 0007TPK00" />
                            <option value="maverick x3 x rs turbo rr smart-shox triple black 0007TPH00" />
                            <option value="maverick x3 x rs turbo rr smart-shox desert tan, carbon black & magma red 0007TPD00" />
                            <option value="maverick x3 x rs turbo rr smart-shox intense blue, carbon black & chalk gray 0007TPM00" />
                            <option value="maverick x3 x mr 64'' turbo rr liquid titanium & magma red 0006VPA00" />
                            <option value="maverick x3 x mr turbo rr liquid titanium & magma red 0009LPA00" />
                            <option value="maverick x3 x rc 64'' turbo rr mineral gray & desert tan 0007KPB00" />
                            <option value="maverick x3 x rc turbo rr mineral gray & desert tan 0009MPB00" />
                            <option value="maverick x3 max ds turbo catalyst gray 0007WPH00" />
                            <option value="maverick x3 max ds turbo octane blue 0007WPB00" />
                            <option value="maverick x3 max ds turbo desert tan & carbon black 0007WPF00" />
                            <option value="maverick x3 max ds turbo rr catalyst gray 0007UPF00" />
                            <option value="maverick x3 max ds turbo rr octane blue 0007UPB00" />
                            <option value="maverick x3 max ds turbo rr desert tan & carbon black 0007UPD00" />
                            <option value="maverick x3 max rs turbo rr catalyst gray 0007YPF00" />
                            <option value="maverick x3 max rs turbo rr octane blue 0007YPB00" />
                            <option value="maverick x3 max rs turbo rr desert tan & carbon black 0007YPD00" />
                            <option value="maverick x3 max x ds turbo rr triple black 0007VPF00" />
                            <option value="maverick x3 max x ds turbo rr desert tan, carbon black & magma red 0007VPB00" />
                            <option value="maverick x3 max x rs turbo rr triple black 0009NPF00" />
                            <option value="maverick x3 max x rs turbo rr desert tan, carbon black & magma red 0009NPB00" />
                            <option value="maverick x3 max x rs turbo rr intense blue, carbon black & chalk gray 0009NPK00" />
                            <option value="maverick x3 max x rs turbo rr smart-shox triple black 0009NPH00" />
                            <option value="maverick x3 max x rs turbo rr smart-shox desert tan, carbon black & magma red 0009NPD00" />
                            <option value="maverick x3 max x rs turbo rr smart-shox intense blue, carbon black & chalk gray 0009NPM00" />
                            <option value="Maverick x3 max x mr turbo rr liquid titanium & magma red 0007ZPA00" />
                            <option value="commander dps 700 tundra green 0009PPB00" />
                            <option value="commander xt 700 oxford blue 0009APB00" />
                            <option value="commander xt 700 triple black 0009APD00" />
                            <option value="commander dps 1000r tundra green 0006PPB00" />
                            <option value="commander xt 1000r oxford blue 0006GPB00" />
                            <option value="commander xt 1000r triple black 0006GPD00" />
                            <option value="commander xt 1000r mossy oak break-up country camo 0006GPF00" />
                            <option value="commander x mr 1000r mossy oak break-up country camo 0006SPA00" />
                            <option value="commander xt-p 1000r desert tan & carbon black 0006YPB00" />
                            <option value="commander max dps 1000r tundra green 0006HPB00" />
                            <option value="commander max xt 1000r oxford blue 0006KPB00" />
                            <option value="commander max xt 1000r triple black 0006KPD00" />
                            <option value="commander max xt 1000r mossy oak break-up country camo 0006KPF00" />
                            <option value="commander max xt-p 1000r desert tan & carbon black 0006CPB00" />
                            <option value="fishpro trophy 170 (tech package) shark grey / orange crush 18PG" />
                            <option value="fishpro sport 170 (sound system) white / gulf stream blue 18PC" />
                            <option value="fishpro sport 170 white / gulf stream blue 18PA" />
                            <option value="fishpro scout 130 white / gulf stream blue 33PA" />
                            <option value="explorer pro 170  (tech package) eclipse black / neon yellow 17PC" />
                            <option value="explorer pro 170 eclipse black / neon yellow 17PA" />
                            <option value="wake™ pro 230 (tech package) neo mint 13PA" />
                            <option value="wake 170 (sound sytem) neo mint 35PC" />
                            <option value="wake 170 neo mint 35PA" />
                            <option value="rxp-x apex 300 racing green (exclusive color) 21PA" />
                            <option value="rxp®-x 300 (tech package) triple black (premium color) 21PE" />
                            <option value="rxp®-x 300 (tech package) millenium yellow 21PJ" />
                            <option value="rxp®-x 300 triple black (premium color) 21PC" />
                            <option value="rxp®-x 300 millenium yellow 21PG" />
                            <option value="rxt®-x® 300 (tech package) triple black (premium color) 10PC" />
                            <option value="rxt®-x® 300 (tech package) millenium yellow 10PA" />
                            <option value="gtr 230 (sound system) millenium yellow 36PC" />
                            <option value="gtr 230 millenium yellow 36PA" />
                            <option value="gtx limited 300 (tech package) metallic sage  (premium color) 14PA" />
                            <option value="gtx limited 300 (tech package) blue abyss 14PC" />
                            <option value="gtx 300 (sound system) eclipse black / orange crush 12PF" />
                            <option value="gtx 300 eclipse black / orange crush 12PE" />
                            <option value="gtx 230 (sound system) eclipse black / orange crush 12PC" />
                            <option value="gtx 230 eclipse black / orange crush 12PA" />
                            <option value="gtx 170  (sound system) eclipse black / orange crush 11PC" />
                            <option value="gtx 170 eclipse black / orange crush 11PA" />
                            <option value="gtx 130 pro with ibr white & reef blue 25PA" />
                            <option value="gtx 130 pro white & reef blue 25PC" />
                            <option value="gti™ se 170  (sound system) ice metal / neo mint 30PG" />
                            <option value="gti™ se 170  (sound system) coral blast / eclipse black 30PE" />
                            <option value="gti se 170 ice metal / neo mintl 30PC" />
                            <option value="gti se 170 coral blast / eclipse black 30PA" />
                            <option value="gti se 130 (sound system) ice metal / neo mint 29PG" />
                            <option value="gti se 130 (sound system) coral blast / eclipse black 29PE" />
                            <option value="gti se 130 ice metal / neo mint 29PC" />
                            <option value="gti se 130 coral blast / eclipse black 29PA" />
                            <option value="gti white / reef blue 38PA" />
                            <option value="spark™ 2up base manta green / white 61PA" />
                            <option value="spark™ 2up ibr® & convenience package manta green / white 64PD" />
                            <option value="spark™ 2uptrixx™ dazzling blue 65PC" />
                            <option value="spark™ 2uptrixx™ dazzling blue(sound system) 65PF" />
                            <option value="spark™ 2uptrixx™ manta green 65PA" />
                            <option value="spark™ 2uptrixx™ manta green(sound system) 65PE" />
                            <option value="spark 3up base manta green / white 62PC" />
                            <option value="spark 3up ibr & convenience package manta green / white 63PD" />
                            <option value="spark 3up ibr & convenience package plus manta green / white(sound system) 63PF" />
                            <option value="spark 3up trixx dazzling blue 66PC" />
                            <option value="spark 3up trixx dazzling blue (sound system) 66PF" />
                            <option value="spark 3up trixx manta green 66PA" />
                            <option value="spark 3up trixx manta green (sound system) 66PE" />
                            <option value="mxz adr w/ blizzard pkg 129 850 e-tec ice ripper xt 1.25 e.s. black UDRA" />
                            <option value="mxz adr w/ blizzard pkg 129 850 e-tec ice ripper xt 1.25 e.s. catalyst grey UDRB" />
                            <option value="mxz adr w/ blizzard pkg 137 850 e-tec ice ripper xt 1.25 e.s. black UDRC" />
                            <option value="mxz adr w/ blizzard pkg 137 850 e-tec ice ripper xt 1.25 e.s. catalyst grey UDRD" />
                            <option value="mxz adr w/ blizzard pkg 129 600r e-tec ice ripper xt 1.25 e.s. black UERA" />
                            <option value="mxz adr w/ blizzard pkg 129 600r e-tec ice ripper xt 1.25 e.s. catalyst grey UERB" />
                            <option value="mxz adr w/ blizzard pkg 137 600r e-tec ice ripper xt 1.25 e.s. black UERC" />
                            <option value="mxz adr w/ blizzard pkg 137 600r e-tec ice ripper xt 1.25 e.s. catalyst grey UERD" />
                            <option value="mxz adrenaline 129 850 e-tec ripsaw 1.25 e.s. black BDRF" />
                            <option value="mxz adrenaline 129 850 e-tec ripsaw 1.25 e.s. neo yellow BDRE" />
                            <option value="mxz adrenaline 137 850 e-tec ripsaw 1.25 e.s. black BDRH" />
                            <option value="mxz adrenaline 137 850 e-tec ripsaw 1.25 e.s. neo yellow BDRG" />
                            <option value="mxz adrenaline 129 600r e-tec ripsaw 1.25 e.s. black BDRB" />
                            <option value="mxz adrenaline 129 600r e-tec ripsaw 1.25 e.s. neo yellow BDRA" />
                            <option value="mxz adrenaline 137 600r e-tec ripsaw 1.25 e.s. black BDRD" />
                            <option value="mxz adrenaline 137 600r e-tec ripsaw 1.25 e.s. neo yellow BDRC" />
                            <option value="mxz sport 129 600 efi ripsaw 1.25 e.s. neo yellow BHRC" />
                            <option value="mxz sport 137 600 efi ripsaw 1.25 e.s. neo yellow BHRB" />
                            <option value="mxz neo+ 600 efi (55) ripsaw 1.25 e.s. neo yellow / black BPRA" />
                            <option value="mxz neo 600 efi (40) cobra 1.0 e.s. neo yellow / catalyst grey BBRA" />
                            <option value="mxz 200 neo yellow YWRB" />
                            <option value="mxz 120 neo yellow YWRA" />
                            <option value="renegade adr w/ enduro pkg 850 e-tec ice ripper xt 1.25' e.s. w/ 10.25' touchscreen black / neo yellow URRA" />
                            <option value="renegade adr w/ enduro pkg 600r e-tec ice ripper xt 1.25' e.s. w/ 10.25' touchscreen black / neo yellow USRA" />
                            <option value="renegade adr w/ enduro pkg 900 ace turbo r ice ripper xt 1.25' e.s. w/ 10.25' touchscreen black / neo yellow DPRA" />
                            <option value="renegade adr w/ enduro pkg 900 ace turbo ice ripper xt 1.25' e.s. w/ 10.25' touchscreen black / neo yellow DRRA" />
                            <option value="renegade adr w/ enduro pkg 900 ace ice ripper xt 1.25' e.s. w/ 10.25' touchscreen black / neo yellow UNRA" />
                            <option value="renegade adrenaline 900 ace turbo r ripsaw 1.25' e.s. black DTRB" />
                            <option value="renegade adrenaline 900 ace turbo r ripsaw 1.25' e.s. neo yellow DTRA" />
                            <option value="renegade adrenaline 900 ace turbo ripsaw 1.25' e.s. black DURB" />
                            <option value="renegade adrenaline 900 ace turbo ripsaw 1.25' e.s. neo yellow DURA" />
                            <option value="renegade adrenaline 900 ace ripsaw 1.25' e.s. black MBRB" />
                            <option value="renegade adrenaline 900 ace ripsaw 1.25' e.s. neo yellow MBRA" />
                            <option value="renegade sport 600 ace ripsaw 1.25' e.s. neo yellow MCRA" />
                            <option value="grand touring le w/ luxury pkg 900 ace turbo r silent ice track ii 1.25' e.s. w/ 10.25' touchscreen terra green EPRB" />
                            <option value="grand touring le w/ luxury pkg 900 ace turbo silent ice track ii 1.25' e.s. w/ 10.25' touchscreen terra green ERRB" />
                            <option value="grand touring le w/ luxury pkg 900 ace silent ice track ii 1.25' e.s. w/ 10.25' touchscreen terra green EBRB" />
                            <option value="grand touring le 900 ace turbo r silent track ii 1.25' e.s. black EPRA" />
                            <option value="grand touring le 900 ace turbo silent track ii 1.25' e.s. black ERRA" />
                            <option value="grand touring le 900 ace silent track ii 1.25' e.s. black EBRA" />
                            <option value="grand touring sport 900 ace silent track ii 1.25' e.s. neo yellow EARA" />
                            <option value="grand touring sport 600 ace silent track ii 1.25' e.s. neo yellow ETRA" />
                            <option value="backcountry adrenaline 850 e-tec cobra 1.6' e.s. black UGRA" />
                            <option value="backcountry adrenaline 850 e-tec powdermax 2.0' e.s. black UGRB" />
                            <option value="backcountry adrenaline 850 e-tec cobra 1.6' e.s. neo yellow UGRC" />
                            <option value="backcountry adrenaline 850 e-tec powdermax 2.0' e.s. neo yellow UGRD" />
                            <option value="backcountry adrenaline 600r e-tec cobra 1.6' e.s. black UJRA" />
                            <option value="backcountry adrenaline 600r e-tec powdermax 2.0' e.s. black UJRB" />
                            <option value="backcountry adrenaline 600r e-tec cobra 1.6' e.s. neo yellow UJRC" />
                            <option value="backcountry adrenaline 600r e-tec powdermax 2.0' e.s. neo yellow UJRD" />
                            <option value="backcountry sport 600 efi cobra 1.6' e.s. neo yellow UBRA" />
                            <option value="backcountry sport 600 efi powdermax 2.0' e.s. neo yellow UBRB" />
                            <option value="expedition le 20' 900 ace turbo r silent cobra 1.5' e.s. black AWRA" />
                            <option value="expedition le 20' 900 ace turbo r silent cobra 1.5' e.s. arctic desert AWRB" />
                            <option value="expedition le 20' 900 ace turbo silent cobra 1.5' e.s. black ACRA" />
                            <option value="expedition le 20' 900 ace turbo silent cobra 1.5' e.s. arctic desert ACRB" />
                            <option value="expedition le 20' 900 ace silent cobra 1.5' e.s. black AARA" />
                            <option value="expedition le 20' 900 ace silent cobra 1.5' e.s. (same as aara) black AARD" />
                            <option value="expedition le 20' 900 ace silent cobra 1.5' e.s. arctic desert AARB" />
                            <option value="expedition le 20' 600r e-tec silent cobra 1.5' e.s. black ABRA" />
                            <option value="expedition le 20' 600r e-tec silent cobra 1.5' e.s. arctic desert ABRB" />
                            <option value="expedition le 24' 900 ace turbo r silent cobra 1.5' e.s. black AXRA" />
                            <option value="expedition le 24' 900 ace turbo r silent cobra 1.5' e.s. arctic desert AXRB" />
                            <option value="expedition le 24' 900 ace turbo silent cobra 1.5' e.s. black ASRA" />
                            <option value="expedition le 24' 900 ace turbo silent cobra 1.5' e.s. arctic desert ASRB" />
                            <option value="expedition le 24' 900 ace silent cobra 1.5' e.s. black ARRA" />
                            <option value="expedition le 24' 900 ace silent cobra 1.5' e.s. (same as arra) black ARRD" />
                            <option value="expedition le 24' 900 ace silent cobra 1.5' e.s. arctic desert ARRB" />
                            <option value="expedition le 24' 600r e-tec silent cobra 1.5' e.s. black AMRA" />
                            <option value="expedition le 24' 600r e-tec silent cobra 1.5' e.s. arctic desert AMRB" />
                            <option value="expedition xtreme 900 ace turbo r cobra 1.8 e.s. black APRD" />
                            <option value="expedition xtreme 900 ace turbo r cobra 1.8 e.s. neo mint APRB" />
                            <option value="expedition xtreme 850 e-tec cobra 1.8 e.s. black ADRD" />
                            <option value="expedition xtreme 850 e-tec cobra 1.8 e.s. neo mint ADRB" />
                            <option value="expedition sport 900 ace charger 1.5' e.s. neo yellow KDRA" />
                            <option value="expedition sport 600 ace charger 1.5' e.s. neo yellow KCRA" />
                            <option value="expedition sport 600 efi charger 1.5' e.s. neo yellow KARA" />
                            <option value="skandic le 20' 900 ace silent cobra 1.5' e.s. black AHRA" />
                            <option value="skandic le 20' 900 ace silent cobra 1.5' e.s. (same as ahra) black AHRD" />
                            <option value="skandic le 20' 900 ace silent cobra 1.5' e.s. arctic desert AHRB" />
                            <option value="skandic le 20' 600 ace silent cobra 1.5' e.s. black AKRA" />
                            <option value="skandic le 20' 600 ace silent cobra 1.5' e.s. arctic desert AKRB" />
                            <option value="skandic le 20' 600r e-tec silent cobra 1.5' e.s. black ALRA" />
                            <option value="skandic le 20' 600r e-tec silent cobra 1.5' e.s. arctic desert ALRB" />
                            <option value="skandic le 20' 600 efi silent cobra 1.5' e.s. black ATRD" />
                            <option value="skandic le 20' 600 efi silent cobra 1.5' e.s. arctic desert ATRB" />
                            <option value="skandic le 24' 900 ace silent cobra 1.5' e.s. black ANRA" />
                            <option value="skandic le 24' 900 ace silent cobra 1.5' e.s. (same as anra) black ANRH" />
                            <option value="skandic le 24' 900 ace silent cobra 1.5' e.s. arctic desert ANRB" />
                            <option value="skandic le 24' 600r e-tec silent cobra 1.5' e.s. black AURA" />
                            <option value="skandic le 24' 600r e-tec silent cobra 1.5' e.s. arctic desert AURB" />
                            <option value="skandic sport 600 efi utility 1.25' e.s. neo yellow AJRA" />
                            <option value="tundra le 600 ace charger 1.5' e.s. black GNRA" />
                            <option value="tundra le 600 efi charger 1.5' e.s. black GDRA" />
                            <option value="tundra le 600 efi charger 1.5' e.s. (same as gdra) black GDRC" />
                            <option value="tundra sport 600 ace cobra 1.6' e.s. neo yellow GMRA" />
                            <option value="tundra sport 600 efi cobra 1.6' e.s. neo yellow GKRA" />
                            <option value="summit adr w/ edge pkg 146 850 e-tec powdermax flexedge 2.5' shot arctic desert CKRD" />
                            <option value="summit adr w/ edge pkg 146 850 e-tec powdermax flexedge 2.5' shot timeless black CKRC" />
                            <option value="summit adr w/ edge pkg 154 850 e-tec powdermax light flexedge 2.5' shot arctic desert CGRC" />
                            <option value="summit adr w/ edge pkg 154 850 e-tec powdermax x-light flexedge 3.0' shot arctic desert CGRD" />
                            <option value="summit adr w/ edge pkg 154 850 e-tec powdermax light flexedge 2.5' shot timeless black CGRA" />
                            <option value="summit adr w/ edge pkg 154 850 e-tec powdermax x-light flexedge 3.0' shot timeless black CGRB" />
                            <option value="summit adr w/ edge pkg 165 850 e-tec powdermax x-light flexedge 3.0' shot arctic desert CHRB" />
                            <option value="summit adr w/ edge pkg 165 850 e-tec powdermax x-light flexedge 3.0' shot timeless black CHRA" />
                            <option value="summit adr w/ edge pkg 146 600r e-tec powdermax flexedge 2.5' shot arctic desert CKRB" />
                            <option value="summit adr w/ edge pkg 146 600r e-tec powdermax flexedge 2.5' shot timeless black CKRA" />
                            <option value="summit adr w/ edge pkg 154 600r e-tec powdermax light flexedge 2.5' shot arctic desert CGRH" />
                            <option value="summit adr w/ edge pkg 154 600r e-tec powdermax light flexedge 2.5' shot timeless black CGRG" />
                            <option value="summit adrenaline 146 850 e-tec powdermax flexedge 2.5' m.s. catalyst grey CDRF" />
                            <option value="summit adrenaline 146 850 e-tec powdermax flexedge 2.5' e.s. catalyst grey CDRE" />
                            <option value="summit adrenaline 146 850 e-tec powdermax flexedge 2.5' shot catalyst grey CDRG" />
                            <option value="summit adrenaline 146 850 e-tec powdermax flexedge 2.5' e.s. timeless black CDRH" />
                            <option value="summit adrenaline 146 850 e-tec powdermax flexedge 2.5' shot timeless black CDRJ" />
                            <option value="summit adrenaline 154 850 e-tec powdermax light flexedge 2.5' m.s. catalyst grey CERH" />
                            <option value="summit adrenaline 154 850 e-tec powdermax light flexedge 2.5' e.s. catalyst grey CERG" />
                            <option value="summit adrenaline 154 850 e-tec powdermax light flexedge 2.5' shot catalyst grey CERF" />
                            <option value="summit adrenaline 154 850 e-tec powdermax light flexedge 2.5' e.s. timeless black CERJ" />
                            <option value="summit adrenaline 154 850 e-tec powdermax light flexedge 2.5' shot timeless black CERK" />
                            <option value="summit adrenaline 146 600r e-tec powdermax flexedge 2.5' m.s. catalyst grey CDRB" />
                            <option value="summit adrenaline 146 600r e-tec powdermax flexedge 2.5' e.s. catalyst grey CDRA" />
                            <option value="summit adrenaline 146 600r e-tec powdermax flexedge 2.5' shot catalyst grey CDRK" />
                            <option value="summit adrenaline 146 600r e-tec powdermax flexedge 2.5' e.s. timeless black CDRC" />
                            <option value="summit adrenaline 146 600r e-tec powdermax flexedge 2.5' shot timeless black CDRD" />
                            <option value="summit adrenaline 154 600r e-tec powdermax light flexedge 2.5' m.s. catalyst grey CERD" />
                            <option value="summit adrenaline 154 600r e-tec powdermax light flexedge 2.5' e.s. catalyst grey CERC" />
                            <option value="summit adrenaline 154 600r e-tec powdermax light flexedge 2.5' shot catalyst grey CERE" />
                            <option value="summit adrenaline 154 600r e-tec powdermax light flexedge 2.5' e.s. timeless black CERA" />
                            <option value="summit adrenaline 154 600r e-tec powdermax light flexedge 2.5' shot timeless black CERB" />
                            <option value="summit neo+ 600 efi (55) hurricane flexedge 1.75 e.s. lac neo yellow / black TVRA" />
                            <option value="summit neo 600 efi (40) cobra flexedge 1.6' e.s. lac neo yellow / catalyst grey TURA" />
                            <option value="switch sport 21' 230hp neon yellow (new catalyst) 51PK" />
                            <option value="switch sport 21' 230hp neon yellow 48PC" />
                            <option value="switch sport 21' 230hp lava red (new catalyst) 51PM" />
                            <option value="switch sport 21' 230hp lava red 48PD" />
                            <option value="switch sport 21' 230hp carribean blue (new catalyst) 51PH" />
                            <option value="switch sport 21' 230hp carribean blue 48PB" />
                            <option value="switch sport 21' 230hp neon yellow (new catalyst) 51PJ" />
                            <option value="switch sport 21' 230hp neon yellow 47PR" />
                            <option value="switch sport 21' 230hp lava red (new catalyst) 51PL" />
                            <option value="switch sport 21' 230hp lava red 47PT" />
                            <option value="switch sport 21' 230hp carribean blue (new catalyst) 51PG" />
                            <option value="switch sport 21' 230hp carribean blue 47PP" />
                            <option value="switch sport 18' 230hp neon yellow (new catalyst) 51PD" />
                            <option value="switch sport 18' 230hp neon yellow 47PZ" />
                            <option value="switch sport 18' 230hp lava red (new catalyst) 51PF" />
                            <option value="switch sport 18' 230hp lava red 48PA" />
                            <option value="switch sport 18' 230hp carribean blue (new catalyst) 51PB" />
                            <option value="switch sport 18' 230hp carribean blue 47PY" />
                            <option value="switch sport 18' 230hp neon yellow (new catalyst) 51PC" />
                            <option value="switch sport 18' 230hp neon yellow 47PK" />
                            <option value="switch sport 18' 230hp lava red (new catalyst) 51PE" />
                            <option value="switch sport 18' 230hp lava red 47PM" />
                            <option value="switch sport 18' 230hp carribean blue (new catalyst) 51PA" />
                            <option value="switch sport 18' 230hp carribean blue 47PH" />
                            <option value="switch sport compact 170hp neon yellow 48PW" />
                            <option value="switch sport compact 170hp lava red 47PX" />
                            <option value="switch sport compact 170hp carribean blue 47PV" />
                            <option value="switch sport compact 170hp neon yellow 47PC" />
                            <option value="switch sport compact 170hp lava red 47PE" />
                            <option value="switch sport compact 170hp carribean blue 47PA" />
                            <option value="switch cruise. 21' 230hp neon yellow (new catalyst) 50PK" />
                            <option value="switch cruise. 21' 230hp neon yellow 45PV" />
                            <option value="switch cruise. 21' 230hp lava red (new catalyst) 50PM" />
                            <option value="switch cruise. 21' 230hp lava red 45PW" />
                            <option value="switch cruise. 21' 230hp carribean blue (new catalyst) 50PH" />
                            <option value="switch cruise. 21' 230hp carribean blue 45PU" />
                            <option value="switch cruise. 21' 230hp neon yellow (new catalyst) 50PJ" />
                            <option value="switch cruise. 21' 230hp neon yellow 46PR" />
                            <option value="switch cruise. 21' 230hp lava red (new catalyst) 50PL" />
                            <option value="switch cruise. 21' 230hp lava red 46PT" />
                            <option value="switch cruise. 21' 230hp carribean blue (new catalyst) 50PG" />
                            <option value="switch cruise. 21' 230hp carribean blue 46PP" />
                            <option value="switch cruise 21' 170hp neon yellow 45PS" />
                            <option value="switch cruise 21' 170hp lava red 45PT" />
                            <option value="switch cruise 21' 170hp carribean blue 45PR" />
                            <option value="switch cruise 21' 170hp neon yellow 46PM" />
                            <option value="switch cruise 21' 170hp lava red 46PN" />
                            <option value="switch cruise 21' 170hp carribean blue 46PL" />
                            <option value="switch cruise 18' 230hp neon yellow (new catalyst) 50PD" />
                            <option value="switch cruise 18' 230hp neon yellow 45PM" />
                            <option value="switch cruise 18' 230hp lava red (new catalyst) 50PF" />
                            <option value="switch cruise 18' 230hp lava red 45PQ" />
                            <option value="switch cruise 18' 230hp carribean blue (new catalyst) 50PB" />
                            <option value="switch cruise 18' 230hp carribean blue 45PJ" />
                            <option value="switch cruise 18' 230hp neon yellow (new catalyst) 50PC" />
                            <option value="switch cruise 18' 230hp neon yellow 45PL" />
                            <option value="switch cruise 18' 230hp lava red (new catalyst) 50PE" />
                            <option value="switch cruise 18' 230hp lava red 45PP" />
                            <option value="switch cruise 18' 230hp carribean blue (new catalyst) 50PA" />
                            <option value="switch cruise 18' 230hp carribean blue 45PH" />
                            <option value="switch cruise 18' 170hp neon yellow 46PZ" />
                            <option value="switch cruise 18' 170hp lava red 45PG" />
                            <option value="switch cruise 18' 170hp carribean blue 46PY" />
                            <option value="switch cruise 18' 170hp neon yellow 46PF" />
                            <option value="switch cruise 18' 170hp lava red 46PJ" />
                            <option value="switch cruise 18' 170hp carribean blue 46PD" />
                            <option value="switch cruise 18' 130hp neon yellow 46PW" />
                            <option value="switch cruise 18' 130hp lava red 46PX" />
                            <option value="switch cruise 18' 130hp carribean blue 46PV" />
                            <option value="switch cruise 18' 130hp neon yellow 46PB" />
                            <option value="switch cruise 18' 130hp lava red 46PC" />
                            <option value="switch cruise 18' 130hp carribean blue 46PA" />
                            <option value="switch 16' 130hp carribean blue 41PP" />
                            <option value="switch 16' 130hp  41PK" />
                            <option value="switch compact 130hp carribean blue 41PN" />
                            <option value="switch compact 130hp  41PJ" />
                            <option value="switch 19' 170hp carribean blue 41PQ" />
                            <option value="switch 19' 170hp  41PL" />
                            <option value="f3 (se6) steel black metallic 000E5PA00" />
                            <option value="f3-s special series (se6) monolith black satin 000E6PA00" />
                            <option value="f3-s special series (se6) manta green 000E6PF00" />
                            <option value="f3-t (se6) pearl white 000H6PA00" />
                            <option value="f3-t (se6) petrol metallic 000H6PB00" />
                            <option value="f3 (se6) steel black metallic 000E5PA00" />
                            <option value="f3-s special series (se6) monolith black satin 000E6PA00" />
                            <option value="f3-s special series (se6) manta green 000E6PF00" />
                            <option value="f3-t (se6) pearl white 000H6PA00" />
                            <option value="rt (se6) petrol metallic 000B2PB00" />
                            <option value="rt (se6) hyper silver 000B2PA00" />
                            <option value="rt limited (se6) petrol metallic / dark 000G1PK00" />
                            <option value="rt limited (se6) deep marsala metallic / dark 000G1PH00" />
                            <option value="rt limited (se6) carbon black / dark 000G1PD00" />
                            <option value="rt limited (se6) hyper silver / dark 000G1PA00" />
                            <option value="rt limited (se6) deep marsala metallic / platinum 000B9PC00" />
                            <option value="rt limited (se6) hyper silver / platinum 000B9PA00" />
                            <option value="rt limited (se6) carbon black / platinum 000B9PB00" />
                            <option value="rt sea-to-sky (se6) green shadow / prosecco 000G2PA00" />
                            <option value="ryker (600 ace) classic, epic or exclusive panel color options** 000F1PA00" />
                            <option value="ryker (900 ace) classic, epic or exclusive panel color options** 000F2PA00" />
                            <option value="ryker sport (900 ace) classic, epic or exclusive panel color options** 000F5PA00" />
                            <option value="ryker rally (900 ace) classic, epic or exclusive panel color options** 000F3PA00" />
                        </datalist>
                    </div>
                </div>
            </Segment>
            <Segment raised>

                <h2>Vehicle Information</h2>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={8}>
                        <div class="group">
                            <input type="text" placeholder="stockNum" {...register("stockNum", {})} />
                            </div>
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
                <input class="button" type="submit" />
            </Segment>
        </form>







    );
}

export default EmptyPage;
