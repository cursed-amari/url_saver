document.addEventListener("DOMContentLoaded", function () {
    const archive = document.getElementById("archive");
    const openArchive = document.getElementById("openArchive");
    const toArchive = document.getElementById("toArchive");
    const deleteArchive = document.getElementById("deleteArchive");

    chrome.storage.local.get(["archives"], function (result) {
        const archives = result.archives || [];
        renderArchive(archives);
    });

    deleteArchive.addEventListener("click", function () {
        const selectedArchiveIndex = archive.selectedIndex;
        if (selectedArchiveIndex !== -1) {
            chrome.storage.local.get(["archives"], function (result) {
                const archives = result.archives || [];
                archives.splice(selectedArchiveIndex, 1);
                chrome.storage.local.set({ archives: archives }, function () {
                    renderArchive(archives);
                });
            });
        }
    });

    openArchive.addEventListener("click", function () {
        const currentArchiveIndex = archive.selectedIndex;
        chrome.storage.local.get(["archives"], function (result) {
            const archives = result.archives || [];
            if (currentArchiveIndex >= 0 && currentArchiveIndex < archives.length) {
                const archive = archives[currentArchiveIndex];
                const urls = archive.archive || [];
                chrome.storage.local.set({ savedUrls: urls }, function () {
                });
            }
        });
    });

    function renderArchive(arch) {
        archive.innerHTML = "";
        if (arch) {
            arch.forEach(function (item) {
                const option = document.createElement("option");
                option.text = item.name;
                archive.add(option);
            });
        }
    }
});