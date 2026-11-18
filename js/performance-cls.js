new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.hadRecentInput) continue;

                console.log("CLS:", entry.value, {
                    tiempo: entry.startTime,
                    fuentes: (entry.sources || []).map(source => ({
                        elemento: source.node?.outerHTML?.slice(0, 200) || null,
                        anterior: source.previousRect?.toJSON(),
                        actual: source.currentRect?.toJSON()
                    }))
                });
            }
        }).observe({
            type: "layout-shift",
            buffered: true
        });
