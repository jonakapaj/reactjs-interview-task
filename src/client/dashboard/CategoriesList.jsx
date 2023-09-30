import React from 'react';

const CategoriesList = ({ categories, selectCategory, createCategory, selectedButton }) => (
    <div className="col-3 p-2 border rounded shadow">
        <button className="bg-success p-1 my-1 rounded text-white"
                style={{width: '100%', background: '#1264A3', borderRadius: '5px'}}
                onClick={createCategory}>Create Category
        </button>
        {categories.map((category, catIndex) => (
            <div key={catIndex} className="mb-2">
                <button
                    className={`btn w-100 ${selectedButton === catIndex ? "btn-primary" : "btn-secondary"}`}
                    onClick={() => selectCategory(catIndex)}
                >
                    {category.name} - {catIndex+1}
                </button>
            </div>
        ))}
    </div>
);

export default CategoriesList;
