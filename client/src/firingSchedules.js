let firingSchedules = [
    {
        "id": 2,
        "user_id": 1,
        "name": "fast fire (No.2)",
        "cone": 7,
        "description": null,
        "is_public": true,
        "end_log_temperature_setpoint": null,
        "created_at": "2019-01-18T18:20:15.000Z",
        "updated_at": "2019-01-18T18:20:15.000Z",
        "firing_schedule_ramps": [
            {
                "id": 3,
                "firing_schedule_id": 2,
                "ramp_index": 0,
                "ramp_rate": 400,
                "target_temperature": 2100,
                "hold_minutes": 0,
                "created_at": "2019-01-18T18:20:16.000Z",
                "updated_at": "2019-01-18T18:20:16.000Z"
            },
            {
                "id": 4,
                "firing_schedule_id": 2,
                "ramp_index": 1,
                "ramp_rate": 135,
                "target_temperature": 2270,
                "hold_minutes": 0,
                "created_at": "2019-01-18T18:20:16.000Z",
                "updated_at": "2019-01-18T18:20:16.000Z"
            }
        ]
    },
    {
        "id": 3,
        "user_id": 1,
        "name": "Fast Bisque Fire",
        "cone": -6,
        "description": null,
        "is_public": true,
        "end_log_temperature_setpoint": null,
        "created_at": "2019-01-18T18:20:15.000Z",
        "updated_at": "2019-01-18T18:20:15.000Z",
        "firing_schedule_ramps": [
            {
                "id": 5,
                "firing_schedule_id": 3,
                "ramp_index": 0,
                "ramp_rate": 200,
                "target_temperature": 200,
                "hold_minutes": 120,
                "created_at": "2019-01-18T18:20:16.000Z",
                "updated_at": "2019-01-18T18:20:16.000Z"
            },
            {
                "id": 6,
                "firing_schedule_id": 3,
                "ramp_index": 1,
                "ramp_rate": 250,
                "target_temperature": 1100,
                "hold_minutes": 0,
                "created_at": "2019-01-18T18:20:16.000Z",
                "updated_at": "2019-01-18T18:20:16.000Z"
            },
            {
                "id": 7,
                "firing_schedule_id": 3,
                "ramp_index": 2,
                "ramp_rate": 400,
                "target_temperature": 1830,
                "hold_minutes": 0,
                "created_at": "2019-01-18T18:20:16.000Z",
                "updated_at": "2019-01-18T18:20:16.000Z"
            }
        ]
    },
    {
        "id": 4,
        "user_id": 1,
        "name": "Fast Bisque Fire (2)",
        "cone": 7,
        "description": null,
        "is_public": true,
        "end_log_temperature_setpoint": null,
        "created_at": "2019-01-18T18:20:15.000Z",
        "updated_at": "2019-01-18T18:20:15.000Z",
        "firing_schedule_ramps": [
            {
                "id": 8,
                "firing_schedule_id": 4,
                "ramp_index": 0,
                "ramp_rate": 400,
                "target_temperature": 1832,
                "hold_minutes": 0,
                "created_at": "2019-01-18T18:20:16.000Z",
                "updated_at": "2019-01-18T18:20:16.000Z"
            },
            {
                "id": 9,
                "firing_schedule_id": 4,
                "ramp_index": 1,
                "ramp_rate": 250,
                "target_temperature": 2100,
                "hold_minutes": 0,
                "created_at": "2019-01-18T18:20:16.000Z",
                "updated_at": "2019-01-18T18:20:16.000Z"
            },
            {
                "id": 10,
                "firing_schedule_id": 4,
                "ramp_index": 2,
                "ramp_rate": 100,
                "target_temperature": 2260,
                "hold_minutes": 0,
                "created_at": "2019-01-18T18:20:16.000Z",
                "updated_at": "2019-01-18T18:20:16.000Z"
            }
        ]
    },
    {
        "id": 5,
        "user_id": 1,
        "name": "lustre?",
        "cone": -18,
        "description": null,
        "is_public": true,
        "end_log_temperature_setpoint": null,
        "created_at": "2019-01-18T18:20:15.000Z",
        "updated_at": "2019-01-18T18:20:15.000Z",
        "firing_schedule_ramps": [
            {
                "id": 3,
                "firing_schedule_id": 5,
                "ramp_index": 0,
                "ramp_rate": 200,
                "target_temperature": 100,
                "hold_minutes": 120,
                "created_at": "2019-01-18T18:20:16.000Z",
                "updated_at": "2019-01-18T18:20:16.000Z"
            },
            {
                "id": 4,
                "firing_schedule_id": 5,
                "ramp_index": 1,
                "ramp_rate": 400,
                "target_temperature": 1300,
                "hold_minutes": 15,
                "created_at": "2019-01-18T18:20:16.000Z",
                "updated_at": "2019-01-18T18:20:16.000Z"
            }
        ]
    },
    {
        "id": 6,
        "user_id": 1,
        "name": "Another example",
        "cone": -6,
        "description": null,
        "is_public": true,
        "end_log_temperature_setpoint": null,
        "created_at": "2019-01-18T18:20:15.000Z",
        "updated_at": "2019-01-18T18:20:15.000Z",
        "firing_schedule_ramps": [
            {
                "id": 5,
                "firing_schedule_id": 6,
                "ramp_index": 0,
                "ramp_rate": 100,
                "target_temperature": 1100,
                "hold_minutes": 120,
                "created_at": "2019-01-18T18:20:16.000Z",
                "updated_at": "2019-01-18T18:20:16.000Z"
            },
            {
                "id": 7,
                "firing_schedule_id": 6,
                "ramp_index": 1,
                "ramp_rate": 200,
                "target_temperature": 1832,
                "hold_minutes": 30,
                "created_at": "2019-01-18T18:20:16.000Z",
                "updated_at": "2019-01-18T18:20:16.000Z"
            }
        ]
    },
    {
        "id": 7,
        "user_id": 1,
        "name": "Another Example (v2)",
        "cone": 10,
        "description": null,
        "is_public": true,
        "end_log_temperature_setpoint": null,
        "created_at": "2019-01-18T18:20:15.000Z",
        "updated_at": "2019-01-18T18:20:15.000Z",
        "firing_schedule_ramps": [
            {
                "id": 8,
                "firing_schedule_id": 7,
                "ramp_index": 0,
                "ramp_rate": 600,
                "target_temperature": 1832,
                "hold_minutes": 0,
                "created_at": "2019-01-18T18:20:16.000Z",
                "updated_at": "2019-01-18T18:20:16.000Z"
            },
            {
                "id": 9,
                "firing_schedule_id": 7,
                "ramp_index": 1,
                "ramp_rate": 250,
                "target_temperature": 2100,
                "hold_minutes": 60,
                "created_at": "2019-01-18T18:20:16.000Z",
                "updated_at": "2019-01-18T18:20:16.000Z"
            },
            {
                "id": 10,
                "firing_schedule_id": 7,
                "ramp_index": 2,
                "ramp_rate": 100,
                "target_temperature": 2300,
                "hold_minutes": 0,
                "created_at": "2019-01-18T18:20:16.000Z",
                "updated_at": "2019-01-18T18:20:16.000Z"
            }
        ]
    }
]

export default firingSchedules