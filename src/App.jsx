import { useEffect, useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("campaigns");

  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem(
      "inventory_campaigns"
    );

    if (saved) {
      return JSON.parse(saved);
    }

    return [
      {
        id: 1,
        name: "Inventário Junho 2026",
        stores: [
          {
            id: 1,
            name: "Loja Campinas",
            address: "Rua José Paulino, 120",
            manager: "Carlos Silva",
            completed: true,
            notes: "Tudo conferido",
            date: "15/06/2026",
          },
        ],
      },
    ];
  });

  // NOVA ABA - INFORMAÇÕES DAS LOJAS
  const [storeInfos, setStoreInfos] =
    useState(() => {
      const saved = localStorage.getItem(
        "store_infos"
      );

      if (saved) {
        return JSON.parse(saved);
      }

      return [
        {
          id: 1,
          name: "Loja Campinas",
          location: "Shopping Campinas",
          city: "Campinas",
          manager: "Carlos Silva",
        },
      ];
    });

  const [selectedCampaign, setSelectedCampaign] =
    useState(null);

  const [newCampaign, setNewCampaign] =
    useState("");

  const [search, setSearch] = useState("");

  const [storeSearch, setStoreSearch] =
    useState("");

  useEffect(() => {
    localStorage.setItem(
      "inventory_campaigns",
      JSON.stringify(campaigns)
    );
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(
      "store_infos",
      JSON.stringify(storeInfos)
    );
  }, [storeInfos]);

  // CRIAR LEVA
  const createCampaign = () => {
    const campaignName = prompt(
      "Digite o nome da nova leva de inventário:"
    );
  
    if (!campaignName) {
      return;
    }
  
    const importFile = window.confirm(
      "Deseja importar um arquivo agora?\n\nOK = Sim\nCancelar = Criar vazio"
    );
  
    const createNewCampaign = (
      importedStores = []
    ) => {
      const newItem = {
        id: Date.now(),
        name: campaignName,
        stores: importedStores,
      };
  
      setCampaigns((prev) => [
        ...prev,
        newItem,
      ]);
  
      alert(
        "Leva criada com sucesso!"
      );
    };
  
    // SE NÃO QUISER IMPORTAR
    if (!importFile) {
      createNewCampaign();
      return;
    }
  
    // CRIAR INPUT DE ARQUIVO
    const input =
      document.createElement("input");
  
    input.type = "file";
  
    input.accept = ".txt,.csv";
  
    input.onchange = (event) => {
      const file =
        event.target.files[0];
  
      if (!file) {
        createNewCampaign();
        return;
      }
  
      const reader =
        new FileReader();
  
      reader.onload = (e) => {
        const text = e.target.result;
  
        const lines = text
          .split(/\r?\n/)
          .map((line) =>
            line.trim()
          )
          .filter(
            (line) => line !== ""
          );
  
        const importedStores =
          lines.map(
            (line, index) => ({
              id:
                Date.now() + index,
              name: line,
              address: "",
              manager: "",
              date: "",
              completed: false,
              notes: "",
            })
          );
  
        createNewCampaign(
          importedStores
        );
      };
  
      reader.readAsText(file);
    };
  
    input.click();
  };

  // ADICIONAR LOJA MANUAL
  const addStoreToCampaign = (
    campaignId
  ) => {
    const storeName = prompt(
      "Nome da loja:"
    );

    if (!storeName) return;

    const address = prompt(
      "Endereço:"
    );

    const manager = prompt(
      "Responsável:"
    );

    const date = prompt(
      "Data do inventário:"
    );

    setCampaigns((prev) =>
      prev.map((campaign) => {
        if (campaign.id !== campaignId)
          return campaign;

        return {
          ...campaign,
          stores: [
            ...campaign.stores,
            {
              id: Date.now(),
              name: storeName,
              address,
              manager,
              date,
              completed: false,
              notes: "",
            },
          ],
        };
      })
    );
  };

  // IMPORTAR LOJAS
  const importStores = (
    event,
    campaignId
  ) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;

      const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line !== "");

      const importedStores = lines.map(
        (line, index) => ({
          id: Date.now() + index,
          name: line,
          address: "",
          manager: "",
          date: "",
          completed: false,
          notes: "",
        })
      );

      setCampaigns((prev) =>
        prev.map((campaign) => {
          if (
            campaign.id !== campaignId
          )
            return campaign;

          return {
            ...campaign,
            stores: [
              ...campaign.stores,
              ...importedStores,
            ],
          };
        })
      );
    };

    reader.readAsText(file);
  };

  // TOGGLE CHECK
  const toggleStore = (
    campaignId,
    storeId
  ) => {
    setCampaigns((prev) =>
      prev.map((campaign) => {
        if (
          campaign.id !== campaignId
        )
          return campaign;

        return {
          ...campaign,
          stores: campaign.stores.map(
            (store) =>
              store.id === storeId
                ? {
                    ...store,
                    completed:
                      !store.completed,
                  }
                : store
          ),
        };
      })
    );
  };

  // NOTAS
  const updateNotes = (
    campaignId,
    storeId,
    value
  ) => {
    setCampaigns((prev) =>
      prev.map((campaign) => {
        if (
          campaign.id !== campaignId
        )
          return campaign;

        return {
          ...campaign,
          stores: campaign.stores.map(
            (store) =>
              store.id === storeId
                ? {
                    ...store,
                    notes: value,
                  }
                : store
          ),
        };
      })
    );
  };

  // EXCLUIR LOJA INVENTÁRIO
  const deleteStore = (
    campaignId,
    storeId
  ) => {
    const confirmDelete = window.confirm(
      "Excluir loja?"
    );

    if (!confirmDelete) return;

    setCampaigns((prev) =>
      prev.map((campaign) => {
        if (
          campaign.id !== campaignId
        )
          return campaign;

        return {
          ...campaign,
          stores: campaign.stores.filter(
            (store) =>
              store.id !== storeId
          ),
        };
      })
    );
  };

  // NOVA ABA - ADICIONAR LOJA INFO
  const addStoreInfo = () => {
    const name = prompt(
      "Nome da loja:"
    );

    if (!name) return;

    const location = prompt(
      "Local:"
    );

    const city = prompt("Cidade:");

    const manager = prompt(
      "Gerente responsável:"
    );

    setStoreInfos((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        location,
        city,
        manager,
      },
    ]);
  };

  // IMPORTAR INFORMAÇÕES DE LOJAS
  const importStoreInfos = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;

      const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line !== "");

      const imported = lines.map(
        (line, index) => ({
          id: Date.now() + index,
          name: line,
          location: "",
          city: "",
          manager: "",
        })
      );

      setStoreInfos((prev) => [
        ...prev,
        ...imported,
      ]);
    };

    reader.readAsText(file);
  };

  // EXCLUIR INFO LOJA
  const deleteStoreInfo = (id) => {
    const confirmDelete = window.confirm(
      "Excluir loja?"
    );

    if (!confirmDelete) return;

    setStoreInfos((prev) =>
      prev.filter((store) => store.id !== id)
    );
  };

  const currentCampaign =
    campaigns.find(
      (c) =>
        c.id === selectedCampaign?.id
    );

  const filteredStores =
    currentCampaign?.stores.filter(
      (store) =>
        store.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    ) || [];

  const filteredStoreInfos =
    storeInfos.filter((store) =>
      store.name
        .toLowerCase()
        .includes(
          storeSearch.toLowerCase()
        )
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f5f7",
        fontFamily: "Arial",
        paddingBottom: "100px",
      }}
    >
{/* HEADER */}
<div
  style={{
    background: "#00a675",
    padding: "20px",
    borderBottom: "1px solid #e5e7eb",
  }}
>
  <h1
    style={{
      margin: 0,
      fontSize: "30px",
      color: "white",
    }}
  >
    Inventários
  </h1>

  <p
    style={{
      color: "white",
      marginTop: "6px",
      opacity: 0.9,
    }}
  >
    Controle corporativo
  </p>
</div>

      {/* CAMPANHAS */}
      {activeTab === "campaigns" && (
        <div style={{ padding: "20px" }}>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <input
              type="text"
              placeholder="Nova leva..."
              value={newCampaign}
              onChange={(e) =>
                setNewCampaign(
                  e.target.value
                )
              }
              style={{
                flex: 1,
                padding: "14px",
                borderRadius: "14px",
                border:
                  "1px solid #ddd",
              }}
            />

            <button
              onClick={createCampaign}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "14px",
                padding: "0 20px",
              }}
            >
              +
            </button>
          </div>

          {campaigns.map((campaign) => {
            const completed =
              campaign.stores.filter(
                (s) => s.completed
              ).length;

            const total =
              campaign.stores.length;

            return (
              <div
                key={campaign.id}
                style={{
                  background: "white",
                  borderRadius: "20px",
                  padding: "20px",
                  marginBottom: "20px",
                  boxShadow:
                    "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h2>
                      📦 {campaign.name}
                    </h2>

                    <p
                      style={{
                        color: "#666",
                      }}
                    >
                      {completed}/{total}{" "}
                      concluídas
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <button
                      onClick={() => {
                        setSelectedCampaign(
                          campaign
                        );
                        setActiveTab(
                          "details"
                        );
                      }}
                      style={{
                        background:
                          "#2563eb",
                        color: "white",
                        border:
                          "none",
                        borderRadius:
                          "12px",
                        padding:
                          "10px 14px",
                      }}
                    >
                      Abrir
                    </button>

                    <button
                      onClick={() =>
                        deleteCampaign(
                          campaign.id
                        )
                      }
                      style={{
                        background:
                          "#ef4444",
                        color: "white",
                        border:
                          "none",
                        borderRadius:
                          "12px",
                        padding:
                          "10px 14px",
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "12px",
                    background:
                      "#e5e7eb",
                    borderRadius:
                      "999px",
                    overflow:
                      "hidden",
                    marginTop: "15px",
                  }}
                >
                  <div
                    style={{
                      width:
                        total > 0
                          ? `${
                              (completed /
                                total) *
                              100
                            }%`
                          : "0%",
                      height: "100%",
                      background:
                        "#22c55e",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETALHES */}
      {activeTab === "details" &&
        currentCampaign && (
          <div style={{ padding: "20px" }}>
            <button
              onClick={() =>
                setActiveTab(
                  "campaigns"
                )
              }
              style={{
                marginBottom: "20px",
                background: "white",
                border:
                  "1px solid #ddd",
                borderRadius: "12px",
                padding: "10px 16px",
              }}
            >
              ← Voltar
            </button>

            <h2>
              📦 {currentCampaign.name}
            </h2>

            <input
              type="text"
              placeholder="Pesquisar loja..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "14px",
                border:
                  "1px solid #ddd",
                marginBottom: "20px",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() =>
                  addStoreToCampaign(
                    currentCampaign.id
                  )
                }
                style={{
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding:
                    "12px 16px",
                }}
              >
                ➕ Adicionar Loja
              </button>

              <label
                style={{
                  background: "#10b981",
                  color: "white",
                  borderRadius: "12px",
                  padding:
                    "12px 16px",
                  cursor: "pointer",
                }}
              >
                📥 Importar

                <input
                  type="file"
                  accept=".txt,.csv"
                  style={{
                    display: "none",
                  }}
                  onChange={(e) =>
                    importStores(
                      e,
                      currentCampaign.id
                    )
                  }
                />
              </label>
            </div>

            {filteredStores.map(
              (store) => (
                <div
                  key={store.id}
                  style={{
                    background: "white",
                    borderRadius:
                      "18px",
                    padding: "18px",
                    marginBottom:
                      "18px",
                    boxShadow:
                      "0 2px 10px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      marginBottom:
                        "15px",
                    }}
                  >
                    <div>
                      <h3>
                        🏪{" "}
                        {
                          store.name
                        }
                      </h3>

                      <p>
                        📍{" "}
                        {
                          store.address
                        }
                      </p>

                      <p>
                        👤{" "}
                        {
                          store.manager
                        }
                      </p>

                      <p>
                        📅{" "}
                        {store.date}
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={
                        store.completed
                      }
                      onChange={() =>
                        toggleStore(
                          currentCampaign.id,
                          store.id
                        )
                      }
                      style={{
                        width: "25px",
                        height:
                          "25px",
                      }}
                    />
                  </div>

                  <textarea
                    placeholder="Observações..."
                    value={
                      store.notes
                    }
                    onChange={(e) =>
                      updateNotes(
                        currentCampaign.id,
                        store.id,
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      minHeight:
                        "90px",
                      borderRadius:
                        "12px",
                      border:
                        "1px solid #ddd",
                      padding:
                        "12px",
                    }}
                  />

                  <div
                    style={{
                      marginTop:
                        "15px",
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >
                    <div>
                      {store.completed ? (
                        <span
                          style={{
                            background:
                              "#dcfce7",
                            color:
                              "#166534",
                            padding:
                              "8px 12px",
                            borderRadius:
                              "999px",
                          }}
                        >
                          ✅
                          Concluído
                        </span>
                      ) : (
                        <span
                          style={{
                            background:
                              "#fef3c7",
                            color:
                              "#92400e",
                            padding:
                              "8px 12px",
                            borderRadius:
                              "999px",
                          }}
                        >
                          ⏳
                          Pendente
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        deleteStore(
                          currentCampaign.id,
                          store.id
                        )
                      }
                      style={{
                        background:
                          "#ef4444",
                        color: "white",
                        border:
                          "none",
                        borderRadius:
                          "10px",
                        padding:
                          "10px 14px",
                      }}
                    >
                      🗑 Excluir
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}

      {/* NOVA ABA - INFORMAÇÕES LOJAS */}
      {activeTab === "storeinfos" && (
        <div style={{ padding: "20px" }}>
          <h2>
            🏪 Informações das Lojas
          </h2>

          <input
            type="text"
            placeholder="Pesquisar loja..."
            value={storeSearch}
            onChange={(e) =>
              setStoreSearch(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border:
                "1px solid #ddd",
              marginBottom: "20px",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={addStoreInfo}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding:
                  "12px 16px",
              }}
            >
              ➕ Adicionar Loja
            </button>

            <label
              style={{
                background: "#10b981",
                color: "white",
                borderRadius: "12px",
                padding:
                  "12px 16px",
                cursor: "pointer",
              }}
            >
              📥 Importar

              <input
                type="file"
                accept=".txt,.csv"
                style={{
                  display: "none",
                }}
                onChange={
                  importStoreInfos
                }
              />
            </label>
          </div>

          {filteredStoreInfos.map(
            (store) => (
              <div
                key={store.id}
                style={{
                  background: "white",
                  borderRadius:
                    "18px",
                  padding: "18px",
                  marginBottom:
                    "18px",
                  boxShadow:
                    "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                <h3>
                  🏪 {store.name}
                </h3>

                <p>
                  📍 Local:{" "}
                  {store.location}
                </p>

                <p>
                  🌆 Cidade:{" "}
                  {store.city}
                </p>

                <p>
                  👤 Gerente:{" "}
                  {store.manager}
                </p>

                <button
                  onClick={() =>
                    deleteStoreInfo(
                      store.id
                    )
                  }
                  style={{
                    background:
                      "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius:
                      "10px",
                    padding:
                      "10px 14px",
                    marginTop: "10px",
                  }}
                >
                  🗑 Excluir
                </button>
              </div>
            )
          )}
        </div>
      )}

      {/* MENU */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          background: "white",
          borderTop:
            "1px solid #ddd",
          display: "flex",
          justifyContent:
            "space-around",
          padding: "14px 0",
          overflowX: "auto",
        }}
      >
        <button
          onClick={() =>
            setActiveTab("campaigns")
          }
          style={{
            background: "none",
            border: "none",
            fontSize: "16px",
            color:
              activeTab ===
              "campaigns"
                ? "#2563eb"
                : "#666",
          }}
        >
          📦 Inventários
        </button>

        <button
          onClick={() => {
            if (selectedCampaign) {
              setActiveTab(
                "details"
              );
            }
          }}
          style={{
            background: "none",
            border: "none",
            fontSize: "16px",
            color:
              activeTab ===
              "details"
                ? "#2563eb"
                : "#666",
          }}
        >
          🏪 Lojas 
        </button>

        <button
          onClick={() =>
            setActiveTab(
              "storeinfos"
            )
          }
          style={{
            background: "none",
            border: "none",
            fontSize: "16px",
            color:
              activeTab ===
              "storeinfos"
                ? "#2563eb"
                : "#666",
          }}
        >
          ℹ️ Informações de Lojas
        </button>
      </div>
    </div>
  );
}

