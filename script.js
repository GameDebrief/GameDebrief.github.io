function loadLatestArticles() {
    const articleContainer = document.getElementById('latest-articles');
    if (!articleContainer) {
        console.error("Error: articleContainer element not found.");
        return;
    }

    fetch('articles.json')
        .then(response => response.json())
        .then(data => {
            const articleFiles = data.articles.map(filename => "articles/" + filename);

            articleFiles.sort((a, b) => {
                const dateA = new Date(a.split('/')[1].split('-')[0]);
                const dateB = new Date(b.split('/')[1].split('-')[0]);
                return dateB - dateA;
            });

            const latestFour = articleFiles.slice(0, 4);

            latestFour.forEach(filename => {
                console.log("Fetching article:", filename);

                fetch(filename)
                    .then(response => {
                        if (!response.ok) {
                            console.error("Error fetching", filename, response.status, response.statusText);
                            throw new Error(`Failed to fetch ${filename}: ${response.status} ${response.statusText}`);
                        }
                        return response.text();
                    })
                    .then(html => {
                        const article = document.createElement('article');
                        article.innerHTML = html;
                        articleContainer.appendChild(article);
                        console.log("Article loaded:", filename);
                    })
                    .catch(error => console.error('Error loading article:', error));
                });
            })
            .catch(error => console.error('Error loading articles.json:', error));
    }

    window.onload = loadLatestArticles;
}
