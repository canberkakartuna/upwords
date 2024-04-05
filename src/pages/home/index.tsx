import React from "react";
import { Typography, Space, Input, Button, message, Table, Modal } from "antd";
import type { TableProps } from "antd";
import "./style.css";

interface Player {
  name: string;
  total: number;
  words: string[];
}

const points: {
  [key: string]: number;
} = {
  A: 12,
  B: 2,
  C: 2,
  Ç: 6,
  D: 2,
  E: 9,
  F: 1,
  G: 1,
  Ğ: 1,
  H: 1,
  I: 4,
  İ: 7,
  J: 1,
  K: 7,
  L: 7,
  M: 4,
  N: 5,
  O: 3,
  Ö: 1,
  P: 2,
  R: 6,
  S: 3,
  Ş: 2,
  T: 5,
  U: 3,
  Ü: 2,
  V: 1,
  Y: 2,
  Z: 2,
};

export default function Home() {
  const [players, setPlayers] = React.useState<Array<string | Player>>([]);
  const [playerName, setPlayerName] = React.useState<string>("");
  const [hasGameStarted, setHasGameStarted] = React.useState<boolean>(false);
  const [data, setData] = React.useState<Player[]>([]);
  const [modalState, setModalState] = React.useState({
    open: false,
    name: "",
  });
  const [word, setWord] = React.useState("");

  const columns: TableProps<Player>["columns"] = [
    {
      title: "İsim",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Kelimeler",
      dataIndex: "words",
      key: "words",
      render: (words: string[]) => (
        <>
          {words.map((word, index) => (
            <Typography.Text key={index}>
              {word}
              {words.length - 1 !== index && ", "}
            </Typography.Text>
          ))}
        </>
      ),
    },
    {
      title: "Toplam Puan",
      dataIndex: "total",
      align: "center",
      key: "total",
    },
    {
      title: "İşlemler",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setModalState({
                open: true,
                name: record.name,
              });
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

    const newPlayers = players
      .filter((player) => typeof player !== "string")
      .map((player) => {
        return {
          name: player?.name,
          words: [],
          total: 0,
        };
      });

    setData(newPlayers);
  }, [players]);

  return (
    <Space className="home-container">
      <Space className="home-container-box" direction="vertical">
        <Typography.Title level={4}>
          {hasGameStarted ? "Oyun Tablosu" : "Upwords Oyuncu Listesi"}
        </Typography.Title>
        {hasGameStarted === false && (
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
              setPlayers([
                ...players,
                { name: playerName, words: [], total: 0 },
              ]);
              setPlayerName("");
            }}
          />
        )}
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
                    newPlayers[index] = {
                      name: e.target.value,
                      total: 0,
                      words: [],
                    };
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
          <Table
            rowKey={(record) => record.name}
            columns={columns}
            dataSource={data}
            pagination={false}
          />
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
            const newPlayers = data.map((player) => {
              if (player.name === modalState.name) {
                return {
                  ...player,
                  words: [...player.words, word],
                  total:
                    player.total +
                    word
                      .toUpperCase()
                      .split("")
                      .reduce((acc, letter) => acc + points[letter], 0),
                };
              }

              return player;
            });

            setData(newPlayers);
            setWord("");
            setModalState({ open: false, name: "" });
          }}
        >
          <Space
            direction="vertical"
            style={{
              width: "100%",
            }}
          >
            <Input
              onChange={(e) => {
                setWord(e.target.value);
              }}
            />
            <Typography.Text>
              Toplam Puan:{" "}
              {word
                .toUpperCase()
                .split("")
                .reduce((acc, letter) => acc + points[letter], 0)}
            </Typography.Text>
          </Space>
        </Modal>
      )}
    </Space>
  );
}
