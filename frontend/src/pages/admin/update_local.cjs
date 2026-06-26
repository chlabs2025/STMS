const fs = require('fs');
const file = 'c:\\Users\\moham\\OneDrive\\Documents\\GitHub\\STMS\\frontend\\src\\pages\\admin\\LocalDetailPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Make name editable
content = content.replace(
  /<h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight truncate">\s*\{formData\.LocalName \|\| local\.LocalName \|\| "Unnamed"\}\s*<\/h1>/,
  `{isEditing ? (
                  <input
                    type="text"
                    name="LocalName"
                    value={formData.LocalName}
                    onChange={handleChange}
                    className="w-full px-2 py-1 bg-white border border-orange-200 rounded text-xl md:text-2xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-1"
                  />
                ) : (
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight truncate">
                    {formData.LocalName || local.LocalName || "Unnamed"}
                  </h1>
                )}`
);

// 2. Remove the buttons from the details card
const buttonsStr = /<div className="flex justify-end mb-4">\s*\{!isEditing \? \(\s*<button\s*onClick=\{\(\) => setIsEditing\(true\)\}\s*className="flex items-center gap-1\.5 px-3 py-1\.5 text-xs sm:text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"\s*>\s*<MdEdit className="text-sm sm:text-base" \/>\s*Edit\s*<\/button>\s*\) : \(\s*<div className="flex items-center gap-2">\s*<button\s*onClick=\{handleUpdate\}\s*disabled=\{isUpdating\}\s*className="flex items-center gap-1 px-3 py-1\.5 text-xs sm:text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"\s*>\s*<MdCheck className="text-sm sm:text-base" \/>\s*Save\s*<\/button>\s*<button\s*onClick=\{\(\) => \{\s*setIsEditing\(false\)\s*setFormData\(\{\s*LocalName: local\.LocalName \|\| "",\s*LocalPhone: local\.LocalPhone \|\| "",\s*LocalAddress: local\.LocalAddress \|\| "",\s*upiId: local\.upiId \|\| \(local\.payment && local\.payment\.localUPI\) \|\| ""\s*\}\)\s*\}\}\s*disabled=\{isUpdating\}\s*className="flex items-center gap-1 px-3 py-1\.5 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"\s*>\s*<MdCancel className="text-sm sm:text-base" \/>\s*Cancel\s*<\/button>\s*<\/div>\s*\)\}\s*<\/div>/;

content = content.replace(buttonsStr, '');

// 3. Insert the buttons back into the header
content = content.replace(
  /<\/div>\r?\n\s*<\/div>\r?\n\s*<\/div>\r?\n\s*\{\/\* ─── Profile Details Card ─── \*\/\}/,
  `</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0 mt-1 sm:mt-0 w-full sm:w-auto justify-end">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <MdEdit className="text-sm sm:text-base" />
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex items-center justify-center gap-1 flex-1 sm:flex-none px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  <MdCheck className="text-sm sm:text-base" />
                  <span className="hidden sm:inline">Save</span>
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setFormData({
                      LocalName: local.LocalName || "",
                      LocalPhone: local.LocalPhone || "",
                      LocalAddress: local.LocalAddress || "",
                      upiId: local.upiId || (local.payment && local.payment.localUPI) || ""
                    })
                  }}
                  disabled={isUpdating}
                  className="flex items-center justify-center gap-1 flex-1 sm:flex-none px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <MdCancel className="text-sm sm:text-base" />
                  <span className="hidden sm:inline">Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ─── Profile Details Card ─── */}`
);

fs.writeFileSync(file, content);
console.log('Done');
