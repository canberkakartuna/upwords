import React from "react";
import { Typography, Space, Input, Button, message, Table, Modal } from "antd";
import type { TableProps } from "antd";
import "./style.css";

interface Player {
  name: string;
  score: number;
}

interface DataType {
  key: React.Key;
  name: string;
  words: string[] | React.ReactNode[];
  total: number;
}

export default function Home() {
  const [players, setPlayers] = React.useState<Array<string | Player>>([]);
  const [playerName, setPlayerName] = React.useState<string>("");
  const [hasGameStarted, setHasGameStarted] = React.useState<boolean>(false);
  const [data, setData] = React.useState<DataType[]>([]);
  const [modalState, setModalState] = React.useState({
    open: false,
    name: "",
  });
  const [word, setWord] = React.useState("");

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "İsim",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Kelimeler",
      dataIndex: "words",
      key: "words",
    },
    {
      title: "Toplam Puan",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setModalState({
                open: true,
                name: record.name,
              });
              //   const newPlayers = data.map((player) => {
              //     if (player.key === record.key) {
              //       return {
              //         ...player,
              //         words: [...player.words, "Yeni Kelime"],
              //         total: player.total + 1,
              //       };
              //     }

              //     return player;
              //   });

              //   setData(newPlayers);
            }}
          >
            Kelime Ekle
          </Button>
        </Space>
      ),
    },
  ];

  React.useEffect(() => {
    if (players.length < 2) {
      return;
    }

    const newPlayers = players.map((player) => {
      if (typeof player === "string") {
        return player;
      }

      return {
        name: player.name,
        words: [],
        total: player.score,
      };
    });

    setData(newPlayers);
  }, [players]);

  return (
    <Space className="home-container">
      <Space className="home-container-box" direction="vertical">
        <Typography.Title level={4}>Upwords Oyuncu Listesi</Typography.Title>
        <Input
          placeholder={`${players.length + 1}. Oyuncu Adı`}
          size="large"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onPressEnter={() => {
            if (!playerName) {
              message.error("Oyuncu adı boş bırakılamaz.");
              return;
            }
            setPlayers([...players, { name: playerName, score: 0 }]);
            setPlayerName("");
          }}
        />
        {hasGameStarted === false && (
          <Space>
            <Button
              size="large"
              onClick={() => {
                if (!playerName) {
                  message.error("Oyuncu adı boş bırakılamaz.");
                  return;
                }
                setPlayers([...players, ""]);
              }}
            >
              Oyuncu Ekle
            </Button>
            <Button
              type="primary"
              size="large"
              disabled={players.length < 2}
              onClick={() => setHasGameStarted(true)}
            >
              Oyuna Başla
            </Button>
          </Space>
        )}

        {hasGameStarted === false &&
          players.map((player, index) => (
            <Space key={index} className="player-box">
              <Typography.Text>{index + 1}. Oyuncu</Typography.Text>
              <Input
                placeholder="Oyuncu Adı"
                size="large"
                value={typeof player === "string" ? "" : player.name}
                onChange={(e) => {
                  if (typeof player === "string") {
                    const newPlayers = [...players];
                    newPlayers[index] = { name: e.target.value, score: 0 };
                    setPlayers(newPlayers);
                  } else {
                    player.name = e.target.value;
                    setPlayers([...players]);
                  }
                }}
              />
              <Button
                size="large"
                onClick={() => {
                  const newPlayers = [...players];
                  newPlayers.splice(index, 1);
                  setPlayers(newPlayers);
                }}
              >
                Sil
              </Button>
            </Space>
          ))}

        {hasGameStarted && (
          <Table columns={columns} dataSource={data} pagination={false} />
        )}
      </Space>

      {modalState.open && (
        <Modal
          title="Kelime Ekle"
          open={modalState.open}
          onCancel={() => {
            setModalState({ open: false, name: "" });
            setWord("");
          }}
          okText="Ekle"
          cancelText="Kapat"
          onOk={() => {
            // TODO: Onay
          }}
        >
          <Input
            onChange={(e) => {
              setWord(e);
            }}
          />
        </Modal>
      )}
    </Space>
  );
}
