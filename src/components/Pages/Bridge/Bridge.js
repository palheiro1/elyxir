import { useState } from 'react';
import SectionSwitch from './SectionSwitch';
import SwapToPolygon from './SwapToPolygon';

const Bridge = ({ infoAccount, cards }) => {
    const [option, setOption] = useState(0);

    return (
        <>
            <SectionSwitch option={option} setOption={setOption} />

            { option === 0 && <SwapToPolygon infoAccount={infoAccount} cards={cards} /> }
        </>
    );
};

export default Bridge;
