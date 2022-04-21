class RelationToR
{
    TYPE = RELATION_TYPE.M_TO_R;
    selected = false;
    modeModifier = 1;

    centerX = 0;
    centerY = 0;

    junction = 0.5;

    constructor(M, R)
    {
        this.indexMem = M;
        this.indexRel = R;
    }

    draw(canvas)
    {
        const Mx = members[this.indexMem].x;
        const My = members[this.indexMem].y;
        const Rx = relations[this.indexRel].centerX;
        const Ry = relations[this.indexRel].centerY;
        this.mode = 0;

        if(Mx !== Rx && My !== Ry)
        {
            this.mode = this.modeModifier % 2 + 1;
        }

        this.centerX = (Mx + Rx) / 2;
        this.centerY = (My + Ry) / 2;

        switch(this.mode)
        {
            //Straight line.
            case 0:
                if(this.selected) line(canvas, Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)), Rx + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), (gridSize / 2) + (BorderSize * 2), COLOR_PALETTE.SELECTED);
                line(canvas, Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)), Rx + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), (gridSize / 2));
                break;
            //Segmented line - vertical junction.
            case 1:
                const distX = (Rx - Mx) * this.junction;
                if(this.selected)
                {
                    line(canvas, Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)), Mx + distX + gridSize, My + (gridSize * 2 - (gridSize / 2)), (gridSize / 2) + (BorderSize * 2), COLOR_PALETTE.SELECTED);
                    line(canvas, Mx + distX + gridSize, My + (gridSize * 2 - (gridSize / 2)), Mx + distX + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), (gridSize / 2) + (BorderSize * 2), COLOR_PALETTE.SELECTED);
                    line(canvas, Mx + distX + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), Rx + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), (gridSize / 2) + (BorderSize * 2), COLOR_PALETTE.SELECTED);
                }
                line(canvas, Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)), Mx + distX + gridSize, My + (gridSize * 2 - (gridSize / 2)), (gridSize / 2));
                line(canvas, Mx + distX + gridSize, My + (gridSize * 2 - (gridSize / 2)), Mx + distX + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), (gridSize / 2));
                line(canvas, Mx + distX + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), Rx + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), (gridSize / 2));
                break;
            //Segmented line - horizontal junction.
            case 2:
                const distY = (Ry - My) * this.junction;
                if(this.selected)
                {
                    line(canvas, Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)), Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)) + distY, (gridSize / 2) + (BorderSize * 2), COLOR_PALETTE.SELECTED);
                    line(canvas, Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)) + distY, Rx + gridSize, My + (gridSize * 2 - (gridSize / 2)) + distY, (gridSize / 2) + (BorderSize * 2), COLOR_PALETTE.SELECTED);
                    line(canvas, Rx + gridSize, My + (gridSize * 2 - (gridSize / 2)) + distY, Rx + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), (gridSize / 2) + (BorderSize * 2), COLOR_PALETTE.SELECTED);
                }
                line(canvas, Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)), Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)) + distY, (gridSize / 2));
                line(canvas, Mx + gridSize, My + (gridSize * 2 - (gridSize / 2)) + distY, Rx + gridSize, My + (gridSize * 2 - (gridSize / 2)) + distY, (gridSize / 2));
                line(canvas, Rx + gridSize, My + (gridSize * 2 - (gridSize / 2)) + distY, Rx + gridSize, Ry + (gridSize * 2 - (gridSize / 2)), (gridSize / 2));
                break;
        }
    }

    isHovering(mouseX, mouseY)
    {
        const Mx = members[this.indexMem].x;
        const My = members[this.indexMem].y;
        const Rx = relations[this.indexRel].centerX;
        const Ry = relations[this.indexRel].centerY;
        
        const x = (mouseX / scale) + cameraX;
        const y = (mouseY / scale) + cameraY;

        const minX = Math.min(Mx, Rx);
        const maxX = Math.max(Mx, Rx);
        const minY = Math.min(My, Ry);
        const maxY = Math.max(My, Ry);

        const minXIsM = minX === Mx;
        const minYIsM = minY === My;

        switch(this.mode)
        {
            case 0: //Straight line.
                //Vertical
                if(Mx === Rx)
                    return pointOnVertical(x, y, minY + (gridSize * 3), maxY, Mx + gridSize, (gridSize / 4));
                //Horizontal
                else return pointOnHorizontal(x, y, minX + (gridSize * 2), maxX, My + (gridSize * 2 - (gridSize / 2)), (gridSize / 4));
            case 1: //Segmented line - vertical junction.
                return pointOnHorizontal(x, y, minX + (gridSize * 2), minX + (maxX - minX) * this.junction + gridSize, (minXIsM ? My: Ry) + (gridSize * 2 - (gridSize / 2)) , (gridSize / 4))
                    || pointOnVertical(x, y, minY + (gridSize * 2 - (gridSize / 2)), maxY + (gridSize * 2 - (gridSize / 2)), minX + (maxX - minX) * this.junction + gridSize, (gridSize / 4))
                    || pointOnHorizontal(x, y, minX + (maxX - minX) * this.junction + gridSize, maxX, (minXIsM ? Ry  : My) + (gridSize * 2 - (gridSize / 2)), (gridSize / 4));
            case 2: //Segmented line - horizontal junction.
                return pointOnVertical(x, y, minY + (gridSize * 3), minY + (maxY - minY) * this.junction + (gridSize * 2 - (gridSize / 2)), (minYIsM ? Mx : Rx) + gridSize, (gridSize / 4))
                    || pointOnHorizontal(x, y, minX + gridSize, maxX + gridSize, minY + (maxY - minY) * this.junction + (gridSize * 2 - (gridSize / 2)), (gridSize / 4))
                    || pointOnVertical(x, y, minY + (maxY - minY) * this.junction + (gridSize * 2 - (gridSize / 2)), maxY, (minYIsM ? Rx : Mx) + gridSize, (gridSize / 4));
        }
        return false;
    }

    update()
    {

    }
}