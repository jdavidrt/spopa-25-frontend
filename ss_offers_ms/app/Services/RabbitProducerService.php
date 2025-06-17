<?php
namespace App\Services;

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;
use Exception;

class RabbitProducerService
{
    protected $connection;
    protected $channel;
    protected $exchange;

    public function __construct()
    {
        $this->exchange = env('RABBITMQ_EXCHANGE', 'events');
        $this->connect();
    }

    private function connect()
    {
        try {
            $this->connection = new AMQPStreamConnection(
                env('RABBITMQ_HOST', 'rabbitmq'),
                env('RABBITMQ_PORT', 5672),
                env('RABBITMQ_USER', 'admin'),
                env('RABBITMQ_PASS', 'admin')
            );

            $this->channel = $this->connection->channel();

            // Garantiza que exista el exchange de tipo "topic"
            $this->channel->exchange_declare(
                $this->exchange,
                'topic',
                false,   // passive
                true,    // durable
                false    // auto_delete
            );

            \Log::info("RabbitMQ connection established successfully");
        } catch (Exception $e) {
            \Log::error("RabbitMQ connection failed: " . $e->getMessage());
            throw $e;
        }
    }

    public function publish(string $routingKey, array $payload): void
    {
        try {
            // Reconnect if connection is lost
            if (!$this->connection || !$this->connection->isConnected()) {
                $this->connect();
            }

            $msg = new AMQPMessage(
                json_encode($payload, JSON_UNESCAPED_UNICODE),
                [
                    'content_type' => 'application/json', 
                    'delivery_mode' => 2 // Make message persistent
                ]
            );

            $this->channel->basic_publish($msg, $this->exchange, $routingKey);
            
            \Log::info("📤 Message published", [
                'exchange' => $this->exchange,
                'routing_key' => $routingKey,
                'payload' => $payload
            ]);
        } catch (Exception $e) {
            \Log::error("❌ Failed to publish message: " . $e->getMessage());
            throw $e;
        }
    }

    public function __destruct()
    {
        try {
            if ($this->channel) {
                $this->channel->close();
            }
            if ($this->connection) {
                $this->connection->close();
            }
        } catch (Exception $e) {
            \Log::error("Error closing RabbitMQ connection: " . $e->getMessage());
        }
    }
}