import { ReactNode } from 'react';
import { Html } from '../../../utils/Html';
import { IRect } from 'bump-ts';

interface ICenteredHTML {
    rect: IRect;
    children: ReactNode;
}

const CenteredHTML = ({ rect, children }: ICenteredHTML) => (
    <Html.In>
        <div className="absolute flex items-center justify-center" style={{ left: rect.x, top: rect.y, height: rect.h, width: rect.w }}>
            {children}
        </div>
    </Html.In>
);

export default CenteredHTML;
