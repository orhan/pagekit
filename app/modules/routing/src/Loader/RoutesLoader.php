<?php

namespace Pagekit\Routing\Loader;

use Pagekit\Event\EventDispatcherInterface;
use Pagekit\Routing\Event\ConfigureRouteEvent;
use Pagekit\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

class RoutesLoader implements LoaderInterface
{
    /**
     * @var EventDispatcherInterface
     */
    protected $events;

    /**
     * @var AnnotationLoader
     */
    protected $loader;

    /**
     * @var RouteCollection
     */
    protected $routes;

    /**
     * Constructor.
     *
     * @param EventDispatcherInterface $events
     * @param AnnotationLoader         $loader
     */
    public function __construct(EventDispatcherInterface $events, AnnotationLoader $loader = null)
    {
        $this->events = $events;
        $this->loader = $loader ?: new AnnotationLoader();
    }

    /**
     * {@inheritdoc}
     */
    public function load($routes)
    {
        $this->routes = new RouteCollection();

        foreach ($routes as $route) {
            foreach ((array) $route->getOption('controller') as $controller) {

                if (is_callable($controller)) {
                    $this->addRoute($route);
                } elseif (class_exists($controller)) {
                    $this->addController($route->getName(), $route, $controller);
                }

            }
        }

        return $this->routes;
    }

    /**
     * Adds a route.
     *
     * @param Route $route
     */
    protected function addRoute($route)
    {
        if ($route = $this->events->trigger(new ConfigureRouteEvent($route))->getRoute()) {
            $this->routes->add($route->getName(), $route);
        }
    }

    /**
     * Adds routes from controller class.
     *
     * @param string $prefix
     * @param Route  $route
     * @param string $controller
     */
    protected function addController($prefix, $route, $controller)
    {
        try {

            foreach ($this->loader->load($controller) as $r) {

                $this->addRoute($r
                    ->setName(trim("$prefix/{$r->getName()}", "/"))
                    ->setPath(rtrim($route->getPath().$r->getPath(), '/'))
                    ->addDefaults($route->getDefaults())
                    ->addRequirements($route->getRequirements())
                );

            }

        } catch (\InvalidArgumentException $e) {}
    }
}
