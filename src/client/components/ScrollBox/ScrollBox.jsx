import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const boxVariant = {
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    hidden: { opacity: 0, scale: 0 }
};

const BoxLeft = () => {

    const control = useAnimation();
    const [ref, inView] = useInView();

    useEffect(() => {
        if (inView) {
            control.start("visible");
        } else {
            control.start("hidden");
        }
    }, [control, inView]);

    return (
        <motion.div
            className="box"
            ref={ref}
            variants={boxVariant}
            initial="hidden"
            animate={control}
        >
            <div className="block-box-left">
                <br></br>
                <h1>Fact 1</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate, ipsa. Iste accusamus a, magni est tenetur nam minus facilis necessitatibus blanditiis dignissimos expedita itaque corporis, possimus cumque et sint maxime!</p>
            </div>
        </motion.div>
    );
};
const BoxRight = () => {

    const control = useAnimation();
    const [ref, inView] = useInView();

    useEffect(() => {
        if (inView) {
            control.start("visible");
        } else {
            control.start("hidden");
        }
    }, [control, inView]);

    return (
        <motion.div
            className="box"
            ref={ref}
            variants={boxVariant}
            initial="hidden"
            animate={control}
        >
            <div className="block-box-right">
                <br></br>
                <h1>Fact 2</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut laboriosam facilis, magnam odit repellat quaerat voluptatem ratione corporis earum quo recusandae. Doloremque veritatis quo, quis fugiat deleniti omnis quasi facere.</p>
            </div>
        </motion.div>
    );
};
export { BoxLeft, BoxRight };