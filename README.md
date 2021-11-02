
# Firebase structures

```text
machine_[number]
ㄴ service_state: [true | false] (default: true)
ㄴ umbrella_val
    ㄴ accumulated_returned_val: [number]
    ㄴ accumulated_shared_val: [number]
    ㄴ returned_val: [number]
    ㄴ shared_val: [number]
ㄴ user_state
    ㄴ returned_all_log
        ㄴ [id]
            ㄴ date_log: [string] (format: 00_00_00)
            ㄴ time_log: [string] (format: 00_00_00)
        ...
    ㄴ shared
        ㄴ [id]
            ㄴ date_log: [string] (format: 00_00_00)
            ㄴ time_log: [string] (format: 00_00_00)
        ...
```
