import React from 'react';

export const TypographyDemo = () => {

    return (
        <div className="p-grid">
            <div className="p-col-12 p-md-6">
                <div className="card">
                    <h1>Heading 1</h1>
                    <h2>Heading 2</h2>
                    <h3>Heading 3</h3>
                    <h4>Heading 4</h4>
                    <h5>Heading 5</h5>
                    <h6>Heading 6</h6>
                </div>

                <div className="card">
                    <h5>Blockquote</h5>
                    <blockquote>Libero voluptatum atque exercitationem praesentium provident odit aperiam.</blockquote>
                </div>
            </div>

            <div className="p-col-12 p-md-6">
                <div className="card">
                    <h5>Paragraph</h5>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Libero voluptatum atque
                    exercitationem praesentium provident odit aperiam, vitae fugit
					dolores nostrum laborum accusamus quia iste facere possimus minus itaque error unde.</p>
                </div>

                <div className="card">
                    <h5>Text Styles</h5>
                    <p><mark>Highlight</mark> text.</p>
                    <p><del>Deleted text.</del></p>
                    <p><u>Underlined Text</u></p>
                    <p><small>Small text.</small></p>
                    <p><strong>Bold text.</strong></p>
                    <p><em>Italic Text.</em></p>
                </div>
            </div>
        </div>
    )
}
