import PlayerSVG from "../../assets/player_assets/player.svg";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {GameRoom} from "types/GameRoom";

const RoomTable = () => {
  const data: GameRoom[] = [
    {
      hostID: "Host 1",
      createdAt: new Date(),
      settings: {
        isInviteOnly: false,
        isSpectatorAllowed: false,
      },
      invitedID: [],
      status: "Waiting",
      players: [
        {
          displayName: "Player 1",
          country: "International",
          avatarID: "2",
          email: "hi@email.com",
          id: "1",
          isReady: true,
          numCardsOnHand: 0,
          numOfGamesPlayed: 0,
          numOfGamesWon: 0,
          position: 0,
          roomID: "1",
        },
        {
          displayName: "Player 1",
          country: "International",
          avatarID: "1",
          email: "hi@email.com",
          id: "1",
          isReady: true,
          numCardsOnHand: 0,
          numOfGamesPlayed: 0,
          numOfGamesWon: 0,
          position: 0,
          roomID: "1",
        },
      ],
      biddingPhase: null,
      trickTakingPhase: null,
      scores: [],
    },
    {
      hostID: "Host 2",
      createdAt: new Date(),
      settings: {
        isInviteOnly: false,
        isSpectatorAllowed: false,
      },
      invitedID: [],
      status: "Waiting",
      players: [],
      biddingPhase: null,
      trickTakingPhase: null,
      scores: [],
    },
  ];

  const columnHelper = createColumnHelper<GameRoom>();

  const columns = [
    columnHelper.accessor("biddingPhase", {
      header: () => <span>Room ID</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("hostID", {
      header: () => <span>Host</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("settings.isInviteOnly", {
      header: () => <span>Type</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("players", {
      header: () => <span>Players</span>,
      cell: (info) => {
        const plyrList = info.cell.getValue();
        return (
          <div>
            {[0, 1, 2, 3].map((index) => (
              <img
                className={`lobby_table_data_players-${
                  plyrList[index] ? "occupied" : "vacant"
                }`}
                src={PlayerSVG}
              />
            ))}
          </div>
        );
      },
    }),
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="lobby-table">
      <thead>
        {/* <tr>
          <th>Room ID</th>
          <th>Host</th>
          <th>Type</th>
        </tr> */}
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody id="lobby_center_rooms_table_body">
        {/* <tr id="Ue4o" className="">
          <td className="" id="">
            Ue4o
          </td>
          <td className="" id="">
            John
          </td>
          <td className="" id="">
            Open
          </td>
          <td className="lobby_table_data_high_karma" id="">
            <div className="high_karma_icon" id=""></div>
          </td>
          <td className="lobby_table_data_players" id="">
            <div className="player_count" id="">
              <div className="tooltip_container" id="">
                <img
                  className="tooltip_container"
                  id=""
                  src="/dist/images/icon_player.svg?v159"
                  alt="Guest"
                />
                <span className="tooltipmediumtext_left" id="">
                  PuppyMei Karma: 20/20
                </span>
              </div>
              <div className="tooltip_container" id="">
                <img
                  className="tooltip_container"
                  id=""
                  src="/dist/images/icon_player.svg?v159"
                  alt="Guest"
                />
                <span className="tooltipmediumtext_left" id="">
                  Tabb#1861 Karma: 19/20
                </span>
              </div>
            </div>
          </td>
        </tr>
        <tr id="Ue4o" className="">
          <td className="" id="">
            Ue4o
          </td>
          <td className="" id="">
            John
          </td>
          <td className="" id="">
            Open
          </td>
          <td className="lobby_table_data_high_karma" id="">
            <div className="high_karma_icon" id=""></div>
          </td>
          <td className="lobby_table_data_players" id="">
            <div className="player_count" id="">
              <div className="tooltip_container" id="">
                <img
                  className="tooltip_container"
                  id=""
                  src="/dist/images/icon_player.svg?v159"
                  alt="Guest"
                />
                <span className="tooltipmediumtext_left" id="">
                  PuppyMei Karma: 20/20
                </span>
              </div>
              <div className="tooltip_container" id="">
                <img
                  className="tooltip_container"
                  id=""
                  src="/dist/images/icon_player.svg?v159"
                  alt="Guest"
                />
                <span className="tooltipmediumtext_left" id="">
                  Tabb#1861 Karma: 19/20
                </span>
              </div>
            </div>
          </td>
        </tr> */}
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RoomTable;
