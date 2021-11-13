Asset Management
assets
asset




https://github.com/MicrosoftArchive

install Redis

virtualenv --python "C:\Users\[username]\AppData\Local\Programs\Python\Python38\python.exe" env

.\env\Scripts\activate
pip install requirements.txt

python main.py



Redis-cli
c:\programe file\redis\redis-cli
keys
get key
hgetall Users
hget Users 123456
hdel Users 123456
FLUSHALL

rust-lang toiko runtime
rustup update
cargo install mini-redis
mini-redis-cli get foo
hello toiko
$ cargo new rust_ex
$ cd rust_ex
Next, open Cargo.toml and add the following right below [dependencies]:

tokio = { version = "1", features = ["full"] }
mini-redis = "0.4"

main.rs and replace the contents of the file with:

use mini_redis::{client, Result};
#[tokio::main]
async fn main() -> Result<()> {
    // Open a connection to the mini-redis address.
    let mut client = client::connect("127.0.0.1:6379").await?;
    // Set the key "hello" with value "world"
    client.set("hello", "world".into()).await?;
    // Get key "hello"
    let result = client.get("hello").await?;
    println!("got value from the server; result={:?}", result);
    Ok(())
}

$ cargo run
got value from the server; result=Some(b"world")


